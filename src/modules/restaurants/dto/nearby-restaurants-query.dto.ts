import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class NearbyRestaurantsQueryDto {
  @ApiPropertyOptional({
    description: 'Nombre de la ciudad para buscar restaurantes cercanos.',
    example: 'Bogotá',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Latitud para búsqueda geográfica.',
    example: 4.711,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({
    description: 'Longitud para búsqueda geográfica.',
    example: -74.0721,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng?: number;
}
