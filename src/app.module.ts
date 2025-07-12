import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs';
import { UsersModule } from './modules/users/users.module';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: minutes(1), // 60 segundos en milisegundos
          limit: 10, // Máximo 10 solicitudes por ventana
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
    }),
    UsersModule,
    AuthModule,
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
