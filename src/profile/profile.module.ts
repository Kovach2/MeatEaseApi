import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from 'src/login/login.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, AuthService, JwtService, LoginService],
})
export class ProfileModule {}
