import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export interface IFriend{
    username: string
    avatar: string
}

@Schema({versionKey: false})
export class User {
    @Prop({ unique:true, required: true })
    username: string;

    @Prop({ unique:true, required: true, })
    email: string;

    @Prop({required: true })
    password: string;

    @Prop()
    avatar: string

    @Prop({type: [{username: String, avatar: String}], unique:true, _id:false})
    friends: IFriend[]

    @Prop()
    conferences: number

    @Prop()
    isAdmin: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);