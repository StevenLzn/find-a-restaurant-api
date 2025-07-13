import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../../../../src/config/envs';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      logout: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
      imports: [
        JwtModule.register({
          secret: envs.jwtSecret,
          signOptions: { expiresIn: envs.jwtExpiration || '1h' },
        }),
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('debe llamar a login del servicio', async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      access_token: 'token',
      user: {},
    });
    const result = await controller.login({
      email: 'test@mail.com',
      password: '12345678',
    });
    expect(result).toHaveProperty('access_token');
    expect(authService.login).toHaveBeenCalled();
  });

  it('debe llamar a logout del servicio', async () => {
    (authService.logout as jest.Mock).mockResolvedValue({
      message: 'Sesión cerrada',
    });
    const req = { user: { sub: '1' } };
    const result = await controller.logout(req);
    expect(result).toEqual({ message: 'Sesión cerrada' });
    expect(authService.logout).toHaveBeenCalledWith('1');
  });
});
