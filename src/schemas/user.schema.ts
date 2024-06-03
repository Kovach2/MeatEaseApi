import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

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

    @Prop([String])
    friends: string[]

    @Prop([String])
    conferences: string[]
}

export const UserSchema = SchemaFactory.createForClass(User);