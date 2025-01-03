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

    getUserInfo = async (data: { token: string, avatar: string }) => {
        try{
            const userData = await this.authService.getUserData(data.token)
            const user : User = await this.userModal.findOne({ username: userData.username })
            return user
        }catch(error){
            console.log(error)
            throw new Error('Failed to update avatar');
        }
    }

    changeUserAvatar = async (data: { token: string, avatar: string }) => {
        try{
            const user = await this.authService.getUserData(data.token)
            const updateUser : User = await this.userModal.findOneAndUpdate({ username: user.username }, { avatar: data.avatar }, { new: true })
            return updateUser
        }catch(error){
            console.log(error)
            throw new Error('Failed to update avatar');
        }
    }

    changePassword = async (data : {token: string, newPassword: string}) => {
        if(data){
            const user = await this.authService.getUserData(data.token)
            const hashNewPassword = await this.authService.hashPassword(data.newPassword)
            const updateUser = await this.userModal.findOneAndUpdate({username: user.username}, {password: hashNewPassword})
            return updateUser ? true : false
        } else {
            return false;
        }
    }

    changeEmail = async (data : {token: string, newEmail: string}) => {
        if(data){
            const user = await this.authService.getUserData(data.token)
            const updateUser = await this.userModal.findOneAndUpdate({username: user.username}, {email: data.newEmail})
            return updateUser ? true : false
        } else {
            return false;
        }
    }

    getAllUsers = async() =>{
        const users = await this.userModal.find({},{_id: 0, password: 0, avatar: 0, friends: 0})
        return users
    }

    delUser = async(props : { username: string }) => {
        try{
            const { username } = props
            await this.userModal.findOneAndDelete({username: username})
            return true
        }catch(e){
            console.log(e)
            return false
        }
    }

    changeUser = async(props : { username: string, email: string, conferences: string, isAdmin: boolean }) => {
        try{
            const { username, email ,conferences , isAdmin } = props
            await this.userModal.findOneAndUpdate({username: username}, {username:username, email: email, conferences:conferences, isAdmin: isAdmin})
            return true
        }catch(e){
            console.log(e)
            return false
        }
    }
}
