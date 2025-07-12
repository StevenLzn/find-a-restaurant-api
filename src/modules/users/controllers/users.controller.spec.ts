import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const mockUsersService = {
      signup: jest.fn().mockImplementation((dto: CreateUserDto) => ({
        id: 'uuid-example',
        email: dto.email,
        name: dto.name,
        lastname: dto.lastname,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('debe registrar un usuario exitosamente', async () => {
    const dto: CreateUserDto = {
      email: 'usuario@ejemplo.com',
      password: 'MiPassword123!',
      name: 'Juan',
      lastname: 'Pérez',
      isActive: true,
    };

    const result = await controller.signup(dto);

    expect(result).toHaveProperty('id');
    expect(result.email).toBe(dto.email);
    expect(result.name).toBe(dto.name);
    expect(result.lastname).toBe(dto.lastname);
    expect(result.isActive).toBe(true);
    expect(usersService.signup).toHaveBeenCalledWith(dto);
  });
});
