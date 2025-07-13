import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAction } from '../entities/user-action.entity';
import { CreateUserActionLog } from '../interfaces/create-user-action-log.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserActionsService {
  constructor(
    @InjectRepository(UserAction)
    private readonly userActionsRepo: Repository<UserAction>,
  ) {}

  async logAction(
    createUserActionLog: CreateUserActionLog,
  ): Promise<UserAction> {
    // Crea la entidad en memoria
    const userAction = this.userActionsRepo.create({
      user_id: createUserActionLog.userId,
      action: createUserActionLog.action,
      resource: createUserActionLog.resource,
      request_body: createUserActionLog.request_body,
      request_params: createUserActionLog.request_params,
      status: createUserActionLog.status,
    });

    // Guarda la entidad en la base de datos
    return this.userActionsRepo.save(userAction);
  }

  // Lista todas las acciones de usuario con paginación, independientemente del usuario que la haya hecho
  async listAllActions(pagination: PaginationDto) {
    const { page = 1, limit = 20 } = pagination;
    const [data, total] = await this.userActionsRepo.findAndCount({
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  // Lista todas las acciones de un usuario específico, consultando por su ID
  async listActionsByUser(userId: string, pagination: PaginationDto) {
    if (!userId) {
      throw new BadRequestException('El id del usuario es requerido');
    }
    const { page = 1, limit = 20 } = pagination;
    const [data, total] = await this.userActionsRepo.findAndCount({
      where: { user_id: userId },
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
