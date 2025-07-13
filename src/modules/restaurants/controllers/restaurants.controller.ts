// restaurants.controller.ts

import {
  BadGatewayException,
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../../src/common/guards/jwt-auth.guard';
import { RestaurantsService } from '../services/restaurants.service';
import { NearbyRestaurantsQueryDto } from '../dto/nearby-restaurants-query.dto';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('getNearbyRestaurants')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener restaurantes cercanos',
    description:
      'Devuelve una lista de restaurantes cercanos a una ciudad o coordenadas geográficas. Requiere autenticación JWT. Debes enviar la ciudad o las coordenadas completas (lat, lng).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de restaurantes cercanos encontrada exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Petición inválida. Debes enviar ciudad o las coordenadas completas (lat, lng).',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 502,
    description: 'Error consultando el proveedor externo de restaurantes.',
    type: BadGatewayException,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno al consultar restaurantes.',
    type: InternalServerErrorException,
  })
  async getNearbyRestaurants(
    @Request() req,
    @Query() query: NearbyRestaurantsQueryDto,
  ) {
    return this.restaurantsService.findNearby(query, req.user.sub);
  }
}
