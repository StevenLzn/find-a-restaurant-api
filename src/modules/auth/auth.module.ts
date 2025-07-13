import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { envs } from 'src/config/envs';
import { UserActionsModule } from '../user-actions/user-actions.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    UsersModule,
    UserActionsModule,
    CommonModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiration || '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
