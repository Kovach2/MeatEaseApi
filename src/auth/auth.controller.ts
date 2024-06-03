import { Controller, Post, Body, UnauthorizedException  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from 'src/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}
  
    // import { Controller, Get, UseGuards } from '@nestjs/common';
    // import { JwtAuthGuard } from './jwt-auth.guard';
    // @UseGuards(JwtAuthGuard)
    @Post('login')
    async login(@Body() loginUser: IUser) {
        console.log(loginUser.username, loginUser.password)
          const user = await this.authService.validateUser(loginUser.username, loginUser.password);
          if (!user) {
              throw new UnauthorizedException('Invalid credentials');
          }
          return this.authService.login(user);
    }
}
