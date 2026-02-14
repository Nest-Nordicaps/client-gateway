import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // Obtiene el request

    // Se valida que el user exista
    if (!request.user) {
      throw new InternalServerErrorException(
        'User not found in request (AuthGuard called?)',
      ); // Se usa el InternalServerErrorException para que se muestre el error en la consola ya que el error es nuestro del servidor(Backend)
    }

    return request.user;
  },
);
