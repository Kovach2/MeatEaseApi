import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(User.name) private userModal: Model<User>,
        private readonly authService: AuthService
    ) {}

    searchFriends = async (data: {searchValue: string}) =>{
        const filter = {}
        const projection = {
            _id: 0,
            email: 0,
            password: 0,
            friends: 0,
            conferences: 0
        }

        const allUsers: User[] = await this.userModal.find(filter, projection)
        const filterFriends = allUsers.filter((friend) => friend.username.toLocaleLowerCase().includes(data.searchValue.toLocaleLowerCase()))

        return filterFriends
    }

    addFriend = async(data: {token: string, friendData: {username: string, avatar: string}})=>{
        if(data){
            const user : User = await this.authService.getUserData(data.token)
            if(!user.friends.some(friend => friend.username === data.friendData.username)){
                const updateUser : User = await this.userModal.findOneAndUpdate({ username: user.username }, { $addToSet: {friends: data.friendData} }, {new: true, projection: {avatar: 0}})
                return updateUser ? true : false
            }else{
                return false
            }
        }
    }

    removeFriend = async(data: {token: string, friendUsername: string}) => {
        if(data){
            const user : User = await this.authService.getUserData(data.token);
            if(user.friends.some(friend => friend.username === data.friendUsername)){
                const updateUser : User = await this.userModal.findOneAndUpdate(
                    { username: user.username }, 
                    { $pull: { friends: { username: data.friendUsername } } }, 
                    { new: true, projection: { avatar: 0 } }
                );
                return updateUser ? {success: true, updateFriendList: updateUser.friends} : {success: false};
            } else {
                return false;
            }
        }
    }
}
