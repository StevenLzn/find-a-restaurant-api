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
    console.log(createUserActionLog);
    
    const userAction = this.userActionsRepo.create({
      user_id: createUserActionLog.userId,
      action: createUserActionLog.action,
      resource: createUserActionLog.resource,
      request_body: createUserActionLog.request_body,
      request_params: createUserActionLog.request_params,
      status: createUserActionLog.status,
    });
    console.log(userAction);
    
    return this.userActionsRepo.save(userAction);
  }

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
