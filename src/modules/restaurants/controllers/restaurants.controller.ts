// restaurants.controller.ts

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RestaurantsService } from '../services/restaurants.service';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('nearby')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getNearby(
    @Query('city') city?: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
  ) {
    return this.restaurantsService.findNearby({ city, lat, lng });
  }
}
