import { Module } from '@nestjs/common';
import { RestaurantsController } from './controllers/restaurants.controller';
import { RestaurantsService } from './services/restaurants.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
