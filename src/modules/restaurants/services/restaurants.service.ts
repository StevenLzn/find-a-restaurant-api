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
import { UserActionsService } from 'src/modules/user-actions/services/user-actions.service';
import { UserActionLogBuilder } from 'src/modules/user-actions/builders/user-action-log.builder';
import { UserActionType } from 'src/common/enums/user-action-type.enum';
import { ResponseStatus } from 'src/common/enums/response-status.enum';
import { AppResources } from 'src/common/enums/app-resources.enum';

@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name);

  constructor(private readonly userActionsService: UserActionsService) {}

  async findNearby(
    params: NearbySearchParams,
    userId: string,
  ): Promise<Restaurant[]> {
    const logBuilder = new UserActionLogBuilder(
      UserActionType.GET_NEARBY_RESTAURANTS,
      AppResources.RESTAURANTS,
    )
      .setRequestParams(JSON.stringify(params))
      .setUserId(userId);

    try {
      let strategy: NearbySearchStrategy;

      if (params.city) {
        strategy = new CityNearbySearchStrategy();
      } else if (params.lat && params.lng) {
        strategy = new CoordinatesNearbySearchStrategy();
      } else {
        throw new BadRequestException(
          'Debes enviar ciudad o las coordenadas completas (lat, lng)',
        );
      }
      this.logger.log(
        `Busqueda de restaurantes con parámetros: ${JSON.stringify(params)}`,
      );
      const restaurants = await strategy.search(params);

      await this.userActionsService.logAction(
        logBuilder.setStatus(ResponseStatus.SUCCESS).build(),
      );

      return restaurants;
    } catch (error) {
      this.logger.error(
        `Error al consultar los restaurantes cercanos: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        await this.userActionsService.logAction(
          logBuilder.setStatus(ResponseStatus.ERROR).build(),
        );
        throw error;
      }

      if (error.message?.includes('Google')) {
        await this.userActionsService.logAction(
          logBuilder.setStatus(ResponseStatus.EXTERNAL_SERVICE_ERROR).build(),
        );
        throw new BadGatewayException(
          'Error consultando el proveedor externo de restaurantes',
        );
      }

      await this.userActionsService.logAction(
        logBuilder.setStatus(ResponseStatus.INTERNAL_SERVER_ERROR).build(),
      );
      throw new InternalServerErrorException(
        'Error interno al consultar restaurantes',
      );
    }
  }
}
