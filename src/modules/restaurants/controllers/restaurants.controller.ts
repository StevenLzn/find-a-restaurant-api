// restaurants.controller.ts

import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RestaurantsService } from '../services/restaurants.service';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('getNearbyRestaurants')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getNearbyRestaurants(
    @Request() req,
    @Query('city') city?: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
  ) {
    return this.restaurantsService.findNearby({ city, lat, lng }, req.user.sub);
  }
}
