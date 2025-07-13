import { Module } from '@nestjs/common';
import { RestaurantsController } from './controllers/restaurants.controller';
import { RestaurantsService } from './services/restaurants.service';
import { UserActionsModule } from '../user-actions/user-actions.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule, UserActionsModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
