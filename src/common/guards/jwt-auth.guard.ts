import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { envs } from '../../../src/config/envs';

// Guard para proteger rutas con JWT
// Este guard verifica la validez del token JWT en la cabecera Authorization
// y extrae el payload del usuario autenticado.
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: envs.jwtSecret,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
