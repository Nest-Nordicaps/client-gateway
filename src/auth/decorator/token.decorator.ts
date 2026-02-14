import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // Obtiene el request

    // Se valida que el token exista
    if (!request.token) {
      throw new InternalServerErrorException(
        'User not found in request (AuthGuard called?)',
      ); // Se usa el InternalServerErrorException para que se muestre el error en la consola ya que el error es nuestro del servidor(Backend)
    }

    return request.token;
  },
);
