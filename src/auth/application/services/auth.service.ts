import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { User } from '../../../users/infra/entities/user.entity';
import { UserService } from '../../../users/application/services/user.service';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  cpf?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
}

interface LoginInput {
  email: string;
  password: string;
  twoFactorToken?: string;
}

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    input: RegisterInput,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const existing = await this.userService.findByEmail(input.email);

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.userService.createUser({
      email: input.email,
      passwordHash,
      name: input.name,
      cpf: input.cpf,
      phone: input.phone,
      birthDate: input.birthDate ? new Date(input.birthDate) : null,
      termsAcceptedAt: input.termsAccepted ? new Date() : null,
      privacyPolicyAcceptedAt: input.privacyPolicyAccepted ? new Date() : null,
    });

    const tokens = await this.getTokens(user);

    return {
      user,
      tokens,
    };
  }

  async login(input: LoginInput): Promise<{
    user: User;
    tokens?: AuthTokens;
    isTwoFactorRequired?: boolean;
  }> {
    const user = await this.userService.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isTwoFactorEnabled) {
      if (!user.twoFactorSecret) {
        throw new UnauthorizedException('2FA configuration error');
      }

      if (!input.twoFactorToken) {
        return {
          user,
          isTwoFactorRequired: true,
        };
      }

      const isTokenValid = authenticator.verify({
        token: input.twoFactorToken,
        secret: user.twoFactorSecret,
      });

      if (!isTokenValid) {
        throw new UnauthorizedException('Invalid 2FA token');
      }
    }

    const tokens = await this.getTokens(user);

    return {
      user,
      tokens,
    };
  }

  async generateTwoFactorSecret(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'FiscControl', secret);
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

    // Save secret but do not enable yet
    user.twoFactorSecret = secret;
    await this.userService.updateUser(user);

    return { secret, qrCodeUrl };
  }

  async enableTwoFactor(userId: string, token: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.twoFactorSecret) {
      throw new BadRequestException('2FA secret not generated');
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA token');
    }

    user.isTwoFactorEnabled = true;
    await this.userService.updateUser(user);

    return { success: true };
  }

  async disableTwoFactor(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = null;
    await this.userService.updateUser(user);

    return { success: true };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.getRefreshTokenSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.getTokens(user);
  }

  private async getTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.getAccessTokenSecret(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expiresIn: this.getAccessTokenExpiresIn() as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.getRefreshTokenSecret(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expiresIn: this.getRefreshTokenExpiresIn() as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private getAccessTokenSecret(): string {
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error('Missing JWT_ACCESS_TOKEN_SECRET environment variable');
    }
    return secret;
  }

  private getRefreshTokenSecret(): string {
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET;
    if (!secret) {
      throw new Error('Missing JWT_REFRESH_TOKEN_SECRET environment variable');
    }
    return secret;
  }

  private getAccessTokenExpiresIn(): string {
    return process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '3600s';
  }

  private getRefreshTokenExpiresIn(): string {
    return process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '7d';
  }
}
