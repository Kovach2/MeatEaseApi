import { Body, Controller, Post } from '@nestjs/common';
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

}
