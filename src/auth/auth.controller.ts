import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { catchError } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorator/user.decorator';
import { CurrentUser } from './interfaces/current-user.interface';
import { Token } from './decorator/token.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  registeUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto).pipe(
      catchError((error) => {
        throw new Error(error);
      }),
    );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto).pipe(
      catchError((error) => {
        throw new Error(error);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@User() user: CurrentUser, @Token() token: string) {
    //Traemos el user y el token del custom decorator

    return { user, token };
  }
}
