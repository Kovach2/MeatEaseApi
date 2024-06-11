import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ProfileService } from './profile.service';

@Controller("/profile")
export class ProfileController {
    constructor(
        private readonly authService: AuthService,
        private readonly profileService: ProfileService
    ) {}
    @Post()
    async getUserData(@Body() data: {token: string}){
        const token = data.token
        return this.authService.getUserData(token)
    }

    @Post("/change/avatar")
    async changeAvatar(@Body() data: {avatar: string, token: string}){
        return this.profileService.changeUserAvatar(data)
    }

    @Post("/change/email")
    async changeEmail(@Body() data: {token: string, newEmail: string}){
        const success = this.profileService.changeEmail(data)
        return {code: 200, success: success, message: "Почта успешно обновлена"}
    }

    @Post("/change/password")
    async changePassword(@Body() data: {newPassword: string, token: string}){
        const success =  this.profileService.changePassword(data)
        return {code: 200, success: success, message: "Пароль успешно обновлен"}
    }

    @Get("/allUsers")
    async getAllUsers(){
        const users =  await this.profileService.getAllUsers()
        return {code: 200, success: true, users}
    }

    @Post("/delUser")
    async delUser(@Body() data: {username: string}){
        const success =  this.profileService.delUser(data)
        return {code: 200, success: success, message: "Пользователь успешно удален"}
    }

    
    @Post("/changeUser")
    async changeUser(@Body() data: {username: string, email: string, conferences: string, isAdmin: boolean}){
        const success =  this.profileService.changeUser(data)
        return {code: 200, success: success, message: "Пользователь успешно изменен"}
    }

}
