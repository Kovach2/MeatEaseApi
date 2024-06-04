import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from 'src/login/login.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [FriendsController],
  providers: [FriendsService, AuthService, JwtService, LoginService],
})
export class FriendsModule {}
