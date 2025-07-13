import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserActionsService } from 'src/modules/user-actions/services/user-actions.service';
import { UserActionType } from 'src/common/enums/user-action-type.enum';
import { ResponseStatus } from 'src/common/enums/response-status.enum';
import { UserActionLogBuilder } from 'src/modules/user-actions/builders/user-action-log.builder';
import { AppResources } from 'src/common/enums/app-resources.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userActionsService: UserActionsService,
  ) {}

  async login(loginDto: LoginDto) {
    // Se busca al usuario por email
    const user = await this.usersService.findByEmail(loginDto.email);
    const { password, ...loginDataWithoutPassword } = loginDto;
    // Se construye parte del log de acción del usuario
    const logBuilder = new UserActionLogBuilder(
      UserActionType.LOGIN,
      AppResources.AUTH,
    ).setRequestBody(JSON.stringify(loginDataWithoutPassword));

    // Si el usuario no exsite, se termina de construir el log, se guarda y se lanza una excepción
    if (!user) {
      await this.userActionsService.logAction(
        logBuilder
          .setUserId(null)
          .setStatus(ResponseStatus.UNAUTHORIZED)
          .build(),
      );
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    // Si las constrañas no coinciden, se termina de construir el log, se guarda y se lanza una excepción
    if (!isValidPassword) {
      await this.userActionsService.logAction(
        logBuilder
          .setUserId(null)
          .setStatus(ResponseStatus.UNAUTHORIZED)
          .build(),
      );
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Payload del JWT
    const payload = { sub: user.id, email: user.email };

    // Se guarda el log de acción del usuario, definiendo el usuario y el estado exitoso
    await this.userActionsService.logAction(
      logBuilder.setUserId(user.id).setStatus(ResponseStatus.SUCCESS).build(),
    );
    this.logger.log(`Usuario ${user.email} ha iniciado sesión exitosamente`);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
      },
    };
  }

  async logout(userId: string) {
    // Se construye la acción de log de usuario para el cierre de sesión y se guarda
    await this.userActionsService.logAction(
      new UserActionLogBuilder(UserActionType.LOGOUT, AppResources.AUTH)
        .setStatus(ResponseStatus.SUCCESS)
        .setUserId(userId)
        .build(),
    );
    this.logger.log(`Usuario ${userId} ha cerrado sesión exitosamente`);
    return { message: 'Sesión cerrada' };
  }
}
