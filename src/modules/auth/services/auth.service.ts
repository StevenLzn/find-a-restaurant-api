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
    const user = await this.usersService.findByEmail(loginDto.email);
    const { password, ...loginDataWithoutPassword } = loginDto;
    const logBuilder = new UserActionLogBuilder(
      UserActionType.LOGIN,
      AppResources.AUTH,
    ).setRequestBody(JSON.stringify(loginDataWithoutPassword));

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

    if (!isValidPassword) {
      await this.userActionsService.logAction(
        logBuilder
          .setUserId(null)
          .setStatus(ResponseStatus.UNAUTHORIZED)
          .build(),
      );
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email };

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
