import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from '../services/restaurants.service';
import { CommonModule } from '../../../common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../../../../src/config/envs';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let restaurantsService: Partial<RestaurantsService>;

  beforeEach(async () => {
    restaurantsService = {
      findNearby: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        JwtModule.register({
          global: true,
          secret: envs.jwtSecret,
          signOptions: { expiresIn: envs.jwtExpiration || '1h' },
        }),
      ],
      controllers: [RestaurantsController],
      providers: [
        { provide: RestaurantsService, useValue: restaurantsService },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
  });

  it('debe llamar a findNearby del servicio con los parámetros correctos', async () => {
    const mockUser = { sub: 'user-id' };
    const query = { city: 'Bogotá' };
    (restaurantsService.findNearby as jest.Mock).mockResolvedValue([
      { name: 'Restaurante 1' },
    ]);
    const result = await controller.getNearbyRestaurants(
      { user: mockUser },
      query,
    );
    expect(result).toEqual([{ name: 'Restaurante 1' }]);
    expect(restaurantsService.findNearby).toHaveBeenCalledWith(
      query,
      'user-id',
    );
  });

  it('debe manejar errores lanzados por el servicio', async () => {
    const mockUser = { sub: 'user-id' };
    const query = {};
    (restaurantsService.findNearby as jest.Mock).mockRejectedValue(
      new Error('Error de servicio'),
    );
    await expect(
      controller.getNearbyRestaurants({ user: mockUser }, query),
    ).rejects.toThrow('Error de servicio');
  });
});
