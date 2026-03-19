import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../../infra/dtos/login.dto';
import { RefreshTokenDto } from '../../infra/dtos/refresh-token.dto';
import { RegisterDto } from '../../infra/dtos/register.dto';
import { EnableTwoFactorDto } from '../../infra/dtos/enable-two-factor.dto';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    refresh: jest.Mock;
    generateTwoFactorSecret: jest.Mock;
    enableTwoFactor: jest.Mock;
    disableTwoFactor: jest.Mock;
  };

  const mockUser = { userId: 'user-id' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refresh: jest.fn(),
            generateTwoFactorSecret: jest.fn(),
            enableTwoFactor: jest.fn(),
            disableTwoFactor: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(
      AuthService,
    ) as unknown as typeof authService;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.register on register', async () => {
    const body: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      cpf: '12345678900',
      phone: '+5511999999999',
    };

    const authResult = {
      user: {
        id: 'user-id',
        email: body.email,
        name: body.name,
        cpf: body.cpf,
        phone: body.phone,
      },
      tokens: {
        accessToken: 'access',
        refreshToken: 'refresh',
      },
    };

    authService.register.mockResolvedValue(authResult);

    const result = await controller.register(body);

    expect(authService.register).toHaveBeenCalledWith({
      email: body.email,
      password: body.password,
      name: body.name,
      cpf: body.cpf,
      phone: body.phone,
    });
    expect(result).toEqual(authResult);
  });

  it('should call authService.login on login', async () => {
    const body: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };

    const authResult = {
      user: {
        id: 'user-id',
        email: body.email,
        name: 'Test User',
        cpf: null,
        phone: null,
        isTwoFactorEnabled: false,
      },
      tokens: {
        accessToken: 'access',
        refreshToken: 'refresh',
      },
    };

    authService.login.mockResolvedValue(authResult);

    const result = await controller.login(body);

    expect(authService.login).toHaveBeenCalledWith({
      email: body.email,
      password: body.password,
      twoFactorToken: undefined,
    });
    expect(result).toEqual(authResult);
  });

  it('should return 2FA required message on login if 2FA is enabled and token missing', async () => {
    const body: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };

    const authResult = {
      user: {
        id: 'user-id',
        email: body.email,
      },
      isTwoFactorRequired: true,
    };

    authService.login.mockResolvedValue(authResult);

    const result = await controller.login(body);

    expect(result).toEqual({
      message: '2FA token required',
      isTwoFactorRequired: true,
      user: {
        id: 'user-id',
        email: body.email,
      },
    });
  });

  it('should call authService.refresh on refresh', async () => {
    const body: RefreshTokenDto = {
      refreshToken: 'refresh-token',
    };

    const tokens = {
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    };

    authService.refresh.mockResolvedValue(tokens);

    const result = await controller.refresh(body);

    expect(authService.refresh).toHaveBeenCalledWith(body.refreshToken);
    expect(result).toEqual({ tokens });
  });

  it('should generate 2FA secret', async () => {
    const mockResult = { secret: 'secret', qrCodeUrl: 'url' };
    authService.generateTwoFactorSecret.mockResolvedValue(mockResult);

    const result = await controller.generateTwoFactor(mockUser);

    expect(authService.generateTwoFactorSecret).toHaveBeenCalledWith(
      mockUser.userId,
    );
    expect(result).toEqual(mockResult);
  });

  it('should enable 2FA', async () => {
    const body: EnableTwoFactorDto = { token: '123456' };
    const mockResult = { success: true };
    authService.enableTwoFactor.mockResolvedValue(mockResult);

    const result = await controller.enableTwoFactor(mockUser, body);

    expect(authService.enableTwoFactor).toHaveBeenCalledWith(
      mockUser.userId,
      body.token,
    );
    expect(result).toEqual(mockResult);
  });

  it('should disable 2FA', async () => {
    const mockResult = { success: true };
    authService.disableTwoFactor.mockResolvedValue(mockResult);

    const result = await controller.disableTwoFactor(mockUser);

    expect(authService.disableTwoFactor).toHaveBeenCalledWith(mockUser.userId);
    expect(result).toEqual(mockResult);
  });
});
