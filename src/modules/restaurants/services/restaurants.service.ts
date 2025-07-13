import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CityNearbySearchStrategy } from '../strategies/city-nearby-search.strategy';
import { CoordinatesNearbySearchStrategy } from '../strategies/coordinates-nearby-search.strategy';
import { NearbySearchParams } from '../interfaces/nearby-search-params.interface';
import { Restaurant } from '../interfaces/restaurant.interface';
import { NearbySearchStrategy } from '../strategies/nearby-search.strategy';

@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name);
  async findNearby(params: NearbySearchParams): Promise<Restaurant[]> {
    try {
      let strategy: NearbySearchStrategy;
      if (params.city) {
        strategy = new CityNearbySearchStrategy();
      } else if (params.lat && params.lng) {
        strategy = new CoordinatesNearbySearchStrategy();
      } else {
        throw new BadRequestException('Debes enviar ciudad o las coordenadas completas (lat, lng)');
      }
      this.logger.log(
        `Busqueda de restaurantes con parámetros: ${JSON.stringify(params)}`,
      );
      return strategy.search(params);
    } catch (error) {
      this.logger.error(
        `Error al consultar los restaurantes cercanos: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      if (error.message?.includes('Google')) {
        throw new BadGatewayException(
          'Error consultando el proveedor externo de restaurantes',
        );
      }

      throw new InternalServerErrorException(
        'Error interno al consultar restaurantes',
      );
    }
  }
}
