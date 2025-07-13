import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '../../../../src/common/guards/jwt-auth.guard';
import { UserActionsService } from '../services/user-actions.service';
import { PaginationDto } from '../../../../src/common/dto/pagination.dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user-actions')
@Controller('user-actions')
export class UserActionsController {
  constructor(private readonly userActionsService: UserActionsService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Listar todas las acciones de todos los usuarios',
    description:
      'Devuelve un listado paginado de todas las acciones registradas en la aplicación. Requiere autenticación JWT.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description:
      'Cantidad de registros por página (por defecto 20, máximo 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de acciones de usuario',
  })
  async listAllActions(@Query() pagination: PaginationDto) {
    return this.userActionsService.listAllActions(pagination);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  @ApiOperation({
    summary: 'Listar acciones de un usuario específico',
    description:
      'Devuelve un listado paginado de las acciones realizadas por un usuario. Requiere autenticación JWT.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del usuario',
    required: true,
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description:
      'Cantidad de registros por página (por defecto 20, máximo 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de acciones del usuario',
  })
  @ApiResponse({
    status: 400,
    description: 'El id del usuario es requerido o inválido',
  })
  async listActionsByUser(
    @Param('id') userId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.userActionsService.listActionsByUser(userId, pagination);
  }
}
