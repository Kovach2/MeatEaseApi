import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class LoginService {
    constructor(@InjectModel(User.name) private userModal: Model<User>) {}
    async findByUsername(username: string){
        const userExist = await this.userModal.findOne({username: username})
        return userExist
    }
}
