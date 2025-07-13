import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs';
import { UsersModule } from './modules/users/users.module';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { UserActionsModule } from './modules/user-actions/user-actions.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: minutes(1), // Cada minuto
          limit: 10, // El usuario puede hacer máximo 10 peticiones por minuto
        },
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbName,
      autoLoadEntities: true,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    RestaurantsModule,
    UserActionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
