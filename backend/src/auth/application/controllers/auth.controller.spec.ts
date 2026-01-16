import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../../infra/dtos/login.dto';
import { RefreshTokenDto } from '../../infra/dtos/refresh-token.dto';
import { RegisterDto } from '../../infra/dtos/register.dto';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    refresh: jest.Mock;
  };

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
    });
    expect(result).toEqual(authResult);
  });

  it('should call authService.refresh on refresh', async () => {
    const body: RefreshTokenDto = {
      refreshToken: 'refresh-token',
    };

    const tokens = {
      accessToken: 'access',
      refreshToken: 'refresh',
    };

    authService.refresh.mockResolvedValue(tokens);

    const result = await controller.refresh(body);

    expect(authService.refresh).toHaveBeenCalledWith(body.refreshToken);
    expect(result).toEqual({ tokens });
  });
});
