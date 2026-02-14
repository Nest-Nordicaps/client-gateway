import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // Obtiene el request
    const token = this.extractTokenFromHeader(request); // Obtiene el token del header que viene en el request
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const { user, token: newToken } = await firstValueFrom(
        this.client.send('auth.verify.token', token),
      ); // Se envia el token al microservicio de auth para hacer la validacion

      request['user'] = user; // Se agrega el payload al request para que en el siguiente middleware se pueda acceder a la informacion del usuario
      request['token'] = newToken; // Se agrega el token al request para que en el siguiente middleware se pueda acceder al token y hacer la autorizacion correspondiente
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []; // Separa el "bearer" del token y lo convierte en un array de dos elementos
    return type === 'Bearer' ? token : undefined;
  }
}
