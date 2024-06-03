import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginService } from '../login/login.service';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly loginService: LoginService,
    ) {}

    // Шифровка пароля
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    // Расшифровка пароля
    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    // Валидация пользователя
    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.loginService.findByUsername(username)
        if (user && await this.comparePasswords(password, user.password)) {
            console.log(user)
          return user;
        }
        return null;
    }

    // Расшифровка токена
    async getUserData(token: string): Promise<User | null>{
        const user : User = await this.jwtService.decode(token)
        const avatar : string = (await this.loginService.findByUsername(user.username)).avatar
        user.avatar = avatar
        return user
    }

    // Генерация токена
    async login(user: User) {
        const payload = { username: user.username, email: user.email, avatar: user.avatar, friends: user.friends, 
            сonferences: user.conferences };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
