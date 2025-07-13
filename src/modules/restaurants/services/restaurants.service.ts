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
    // Se construye parte del log de acción del usuario
    const logBuilder = new UserActionLogBuilder(
      UserActionType.GET_NEARBY_RESTAURANTS,
      AppResources.RESTAURANTS,
    )
      .setRequestParams(JSON.stringify(params))
      .setUserId(userId);

    try {
      let strategy: NearbySearchStrategy;
      // Se determina la estrategia de búsqueda según los parámetros proporcionados
      // Se usa el patrón de estrategia para encapsular las diferentes lógicas de búsqueda
      if (params.city) {
        // Si se proporciona una ciudad, se usa CityNearbySearchStrategy
        strategy = new CityNearbySearchStrategy();
      } else if (params.lat && params.lng) {
        // Si se proporcionan coordenadas, se usa CoordinatesNearbySearchStrategy
        strategy = new CoordinatesNearbySearchStrategy();
      } else {
        throw new BadRequestException(
          'Debes enviar ciudad o las coordenadas completas (lat, lng)',
        );
      }
      this.logger.log(
        `Busqueda de restaurantes con parámetros: ${JSON.stringify(params)}`,
      );

      // Se realiza la búsqueda de restaurantes usando la estrategia seleccionada
      const restaurants = await strategy.search(params);

      // Se termina de construir el log de acción del usuario, en este caso exitosa y se guarda
      await this.userActionsService.logAction(
        logBuilder.setStatus(ResponseStatus.SUCCESS).build(),
      );

      return restaurants;
    } catch (error) {
      this.logger.error(
        `Error al consultar los restaurantes cercanos: ${error.message}`,
        error.stack,
      );

      // En caso de error http, se termina de construir el log de acción del usuario y se guarda
      if (error instanceof HttpException) {
        await this.userActionsService.logAction(
          logBuilder.setStatus(ResponseStatus.ERROR).build(),
        );
        throw error;
      }

      // En caso de error del proveedor, se termina de construir el log de acción del usuario y se guarda
      if (error.message?.includes('Google')) {
        await this.userActionsService.logAction(
          logBuilder.setStatus(ResponseStatus.EXTERNAL_SERVICE_ERROR).build(),
        );
        throw new BadGatewayException(
          'Error consultando el proveedor externo de restaurantes',
        );
      }

      // En caso de error genérico, se termina de construir el log de acción del usuario y se guarda
      await this.userActionsService.logAction(
        logBuilder.setStatus(ResponseStatus.INTERNAL_SERVER_ERROR).build(),
      );
      throw new InternalServerErrorException(
        'Error interno al consultar restaurantes',
      );
    }
  }
}
