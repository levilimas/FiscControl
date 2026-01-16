import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../../infra/dtos/login.dto';
import { RefreshTokenDto } from '../../infra/dtos/refresh-token.dto';
import { RegisterDto } from '../../infra/dtos/register.dto';

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
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        cpf: result.user.cpf,
        phone: result.user.phone,
      },
      tokens: result.tokens,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login({
      email: body.email,
      password: body.password,
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        cpf: result.user.cpf,
        phone: result.user.phone,
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
}
