import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Conference>;

interface IUsers{
    username: string
}

@Schema({versionKey: false})
export class Conference {
    @Prop({ unique:true, required: true })
    conferenceId: string;

    @Prop({type: {username: String}, _id:false})
    users: IUsers[]
}

export const ConferenceSchema = SchemaFactory.createForClass(Conference);