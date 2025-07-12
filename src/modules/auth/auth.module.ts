import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './guards/jwt-auth.guard';
import { envs } from 'src/config/envs';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiration || '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
