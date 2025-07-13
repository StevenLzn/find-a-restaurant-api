import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActionsService } from '../../../../src/modules/user-actions/services/user-actions.service';
import { UserActionLogBuilder } from '../../../../src/modules/user-actions/builders/user-action-log.builder';
import { UserActionType } from '../../../../src/common/enums/user-action-type.enum';
import { AppResources } from '../../../../src/common/enums/app-resources.enum';
import { ResponseStatus } from '../../../../src/common/enums/response-status.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly SALT_ROUNDS = 10;
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly userActionsService: UserActionsService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { password, ...createUserWithoutPassword } = createUserDto;
    // Se construye parte del log de acción del usuario
    const logBuilder = new UserActionLogBuilder(
      UserActionType.SIGNUP,
      AppResources.USERS,
    ).setRequestBody(JSON.stringify(createUserWithoutPassword));
    try {
      // Verifica si el usuario ya existe por email
      const userExists = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      // Si existe se lanza una excepción de conflicto
      if (userExists) {
        throw new ConflictException('El email ya está registrado');
      }

      // Se hace hash de la contraseña
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        this.SALT_ROUNDS,
      );

      // Se crea objeto con la contraseña hasheada
      const userData = {
        ...createUserDto,
        password: hashedPassword,
      };

      const newUserEntityInstance = this.usersRepository.create(userData); // Crea una nueva instancia de la entidad User
      const savedUser = await this.usersRepository.save(newUserEntityInstance); // Guarda la entidad en la base de datos
      const { password, ...userWithoutPassword } = savedUser;
      // Se termina de construir el log de acción del usuario, en este caso exitosa y se guarda
      await this.userActionsService.logAction(
        logBuilder
          .setUserId(userWithoutPassword.id)
          .setStatus(ResponseStatus.SUCCESS)
          .build(),
      );
      this.logger.log(`Usuario creado exitosamente: ${savedUser.id}`);
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(
        `Error al crear usuario: ${error.message}`,
        error.stack,
      );

      // Si el error es de conflicto, se termina de construir el log de acción del usuario y se guarda
      if (error instanceof ConflictException) {
        await this.userActionsService.logAction(
          logBuilder.setUserId(null).setStatus(ResponseStatus.CONFLICT).build(),
        );
        throw error;
      }

      // En caso de error interno del servidor, se termina de construir el log de acción del usuario y se guarda
      await this.userActionsService.logAction(
        logBuilder
          .setUserId(null)
          .setStatus(ResponseStatus.INTERNAL_SERVER_ERROR)
          .build(),
      );
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({
        where: { email },
      });
    } catch (error) {
      this.logger.error(
        `Error al buscar usuario por email: ${email}, error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }
}
