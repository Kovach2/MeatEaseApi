import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { IUser } from '../interfaces/user.interface';
import { MongooseError } from 'mongoose';



@Controller("/register")
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Post()
    async registerUser(@Body() userData: IUser){
        try{
            return {code: 200, success: true, message: "Вы успешно зарегистрировались!", user: await this.registerService.registerUser(userData)}
        }catch(error){
            if(error.keyPattern.username){
                return {code:500, success:false, message: "Пользователь с таким логином уже существует!"}
            }else if(error.keyPattern.email){
                return {code:500, success:false, message: "Пользователь с такой почтой уже существует!"}
            }else{
                return error
            }
        }

    }
}
