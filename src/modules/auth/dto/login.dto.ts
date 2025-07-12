import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
    format: 'email',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiPassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  readonly password: string;
}
