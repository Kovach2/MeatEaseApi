import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(User.name) private userModal: Model<User>,
        private readonly authService: AuthService
    ) {}

    changeUserAvatar = async (data: {token: string, avatar: string}) => {
        try{
            const user = await this.authService.getUserData(data.token)
            console.log(data)
            const updateUser : User = await this.userModal.findOneAndUpdate({username: user.username},{avatar: data.avatar}, {new: true})
            return updateUser
        }catch(error){
            console.log(error)
            throw new Error('Failed to update avatar');
        }
    }
}
