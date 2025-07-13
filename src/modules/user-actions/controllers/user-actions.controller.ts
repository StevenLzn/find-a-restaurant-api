import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserActionsService } from '../services/user-actions.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('user-actions')
export class UserActionsController {
  constructor(private readonly userActionsService: UserActionsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async listAllActions(@Query() pagination: PaginationDto) {
    return this.userActionsService.listAllActions(pagination);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async listActionsByUser(
    @Param('id') userId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.userActionsService.listActionsByUser(userId, pagination);
  }
}
