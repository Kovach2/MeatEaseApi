import { Controller, Post, Body } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller("/friend")
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService
    ) {}

    @Post("/search")
    async searchFriends(@Body() data: {searchValue: string}){
        try {
            const findFrineds = await this.friendsService.searchFriends(data)
            return {code: 200, success: true, friends: findFrineds}
        } catch (error) {
            console.log(error)
            throw new Error("Can't find friends");
        }
    }

    @Post("/add")
    async addFriend(@Body() data: {token: string, friendData: {username: string, avatar: string}}){
        try{
            const success = await this.friendsService.addFriend(data)
            if(success){
                return( {code: 200, success: success, message: "Пользователь добавлен в друзья."} )
            }else{
                return( {code: 400, success: success, message: "Пользователь уже у вас в друзьях."} )
            }
        }catch(error){
            console.log("Ошибка при добавлении пользователя")
            throw new Error(error);
        }
    }

    @Post("/remove")
    async removeFriend(@Body() data: {token: string, friendUsername: string}){
        try{
            const success = await this.friendsService.removeFriend(data)
            if(success){
                return( {code: 200, success: success.success, updatedFriendList: success.updateFriendList, message: "Пользователь успешно удален."} )
            }else{
                return( {code: 400, success: success, message: "Ошибка при удалении"} )
            }
        }catch(error){
            console.log("Ошибка при добавлении пользователя")
            throw new Error(error);
        }
    }
}
