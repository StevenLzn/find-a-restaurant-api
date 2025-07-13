import { Module } from '@nestjs/common';
import { UserActionsService } from './services/user-actions.service';
import { UserAction } from './entities/user-action.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActionsController } from './controllers/user-actions.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserAction]), CommonModule],
  controllers: [UserActionsController],
  providers: [UserActionsService],
  exports: [UserActionsService],
})
export class UserActionsModule {}
