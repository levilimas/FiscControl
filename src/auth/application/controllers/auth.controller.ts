import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../../infra/dtos/login.dto';
import { RefreshTokenDto } from '../../infra/dtos/refresh-token.dto';
import { RegisterDto } from '../../infra/dtos/register.dto';
import { EnableTwoFactorDto } from '../../infra/dtos/enable-two-factor.dto';
import { JwtAuthGuard } from '../../infra/guards/jwt-auth.guard';
import { CurrentUser } from '../../infra/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  async register(@Body() body: RegisterDto) {
    const result = await this.authService.register({
      email: body.email,
      password: body.password,
      name: body.name,
      cpf: body.cpf,
      phone: body.phone,
      birthDate: body.birthDate,
      termsAccepted: body.termsAccepted,
      privacyPolicyAccepted: body.privacyPolicyAccepted,
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        cpf: result.user.cpf,
        phone: result.user.phone,
        birthDate: result.user.birthDate,
      },
      tokens: result.tokens,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or 2FA token required.',
  })
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login({
      email: body.email,
      password: body.password,
      twoFactorToken: body.twoFactorToken,
    });

    if (result.isTwoFactorRequired) {
      return {
        message: '2FA token required',
        isTwoFactorRequired: true,
        user: {
          id: result.user.id,
          email: result.user.email,
        },
      };
    }

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        cpf: result.user.cpf,
        phone: result.user.phone,
        isTwoFactorEnabled: result.user.isTwoFactorEnabled,
      },
      tokens: result.tokens,
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 201, description: 'Token successfully refreshed.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refresh(@Body() body: RefreshTokenDto) {
    const tokens = await this.authService.refresh(body.refreshToken);

    return {
      tokens,
    };
  }

  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate 2FA Secret and QR Code URL' })
  @ApiResponse({ status: 201, description: 'QR Code URL generated.' })
  async generateTwoFactor(@CurrentUser() user: { userId: string }) {
    const { secret, qrCodeUrl } =
      await this.authService.generateTwoFactorSecret(user.userId);

    return {
      secret,
      qrCodeUrl,
    };
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable 2FA' })
  @ApiResponse({ status: 200, description: '2FA enabled successfully.' })
  async enableTwoFactor(
    @CurrentUser() user: { userId: string },
    @Body() body: EnableTwoFactorDto,
  ) {
    return this.authService.enableTwoFactor(user.userId, body.token);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable 2FA' })
  @ApiResponse({ status: 200, description: '2FA disabled successfully.' })
  async disableTwoFactor(@CurrentUser() user: { userId: string }) {
    return this.authService.disableTwoFactor(user.userId);
  }
}
