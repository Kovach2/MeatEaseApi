import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { Conference } from 'src/schemas/conference.schema';


@Injectable()
export class ConferenceService {
    constructor(
        @InjectModel(User.name) private userModal: Model<User>,
        @InjectModel(Conference.name) private conferenceModal: Model<Conference>
    ){}

    createConference = async() => {

    }
}

