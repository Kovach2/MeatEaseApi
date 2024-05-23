import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginService } from 'src/login/login.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [    
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    JwtModule.register({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '48h' },
    }),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,LoginService],
})
export class AuthModule {}
