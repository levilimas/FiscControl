import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type ms from 'ms';
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
}

interface LoginInput {
  email: string;
  password: string;
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
    });

    const tokens = await this.getTokens(user);

    return {
      user,
      tokens,
    };
  }

  async login(input: LoginInput): Promise<{ user: User; tokens: AuthTokens }> {
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

    const tokens = await this.getTokens(user);

    return {
      user,
      tokens,
    };
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
        expiresIn: this.getAccessTokenExpiresIn(),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.getRefreshTokenSecret(),
        expiresIn: this.getRefreshTokenExpiresIn(),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private getAccessTokenSecret(): string {
    return process.env.JWT_ACCESS_TOKEN_SECRET ?? 'default_jwt_access_secret';
  }

  private getRefreshTokenSecret(): string {
    return process.env.JWT_REFRESH_TOKEN_SECRET ?? 'default_jwt_refresh_secret';
  }

  private getAccessTokenExpiresIn(): ms.StringValue {
    return (process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ??
      '3600s') as ms.StringValue;
  }

  private getRefreshTokenExpiresIn(): ms.StringValue {
    return (process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '7d') as ms.StringValue;
  }
}
