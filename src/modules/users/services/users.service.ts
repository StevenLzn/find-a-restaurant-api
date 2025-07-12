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

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly SALT_ROUNDS = 10;
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const userExists = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (userExists) {
        throw new ConflictException('El email ya está registrado');
      }

      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        this.SALT_ROUNDS,
      );

      const userData = {
        ...createUserDto,
        password: hashedPassword,
      };

      const newUserEntityInstance = this.usersRepository.create(userData);
      const savedUser = await this.usersRepository.save(newUserEntityInstance);
      const { password, ...userWithoutPassword } = savedUser;

      this.logger.log(`Usuario creado exitosamente: ${savedUser.id}`);
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(
        `Error al crear usuario: ${error.message}`,
        error.stack,
      );
      if (error instanceof ConflictException) {
        throw error;
      }
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
