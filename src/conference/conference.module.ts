import { ConferenceController } from './conference.controller';
import { ConferenceService } from './conference.service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Conference, ConferenceSchema } from 'src/schemas/conference.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoGateway } from './video.gateway';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from 'src/login/login.service';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, {name: Conference.name, schema:ConferenceSchema}]),
    ],
    controllers: [ConferenceController],
    providers: [ConferenceService, VideoGateway, AuthService, JwtService, LoginService],
})
export class ConferenceModule{

}
