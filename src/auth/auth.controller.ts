import { Controller, Post, Body, UnauthorizedException  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from 'src/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}
    @Post('login')
    async login(@Body() loginUser: IUser) {
          const user = await this.authService.validateUser(loginUser.username, loginUser.password);
          if (!user) {
              throw new UnauthorizedException('Invalid credentials');
          }
          return await this.authService.login(user);
    }
}
