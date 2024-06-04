import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { IUser } from '../interfaces/user.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RegisterService {
    constructor(@InjectModel(User.name) private userModal: Model<User>) {}

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async registerUser(user: IUser){
        console.log(user)

        const newUser : IUser = {
            username: user.username,
            email: user.email,
            password: await this.hashPassword(user.password),
            avatar: process.env.DEFAULT_USER_AVATAR,
            friends: [],
            conferences: []
        }
        const registerUser = await this.userModal.create(newUser)
        return registerUser
    }
}
