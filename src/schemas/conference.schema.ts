import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type UserDocument = HydratedDocument<Conference>;

export interface IConferenceUsers{
    userId?: string
    username: string
    avatar: string
    isMicroOn: boolean
    isVideoOn: boolean
}

@Schema({versionKey: false})
export class Conference {
    @Prop({ unique:true, required: true })
    conferenceId: string;

    @Prop({type: [{userId: String, username: String, avatar: String, isMicroOn: Boolean, isVideoOn: Boolean}], _id:false})
    users: IConferenceUsers[]
}

export const ConferenceSchema = SchemaFactory.createForClass(Conference);