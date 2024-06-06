import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type UserDocument = HydratedDocument<Conference>;

export interface IConferenceUsers{
    username: string
    avatar: string
    isMicroOn: boolean
    isVideoOn: boolean
}

interface IChatMessage{
    username: string
    message: string
}

@Schema({versionKey: false})
export class Conference {
    @Prop({ unique:true, required: true })
    conferenceId: string;

    @Prop({type: [{username: String, avatar: String, isMicroOn: Boolean, isVideoOn: Boolean}], _id:false})
    users: IConferenceUsers[]

    @Prop({type: [{username: String, message:String}], _id: false})
    chatMessage: IChatMessage[]
}

export const ConferenceSchema = SchemaFactory.createForClass(Conference);