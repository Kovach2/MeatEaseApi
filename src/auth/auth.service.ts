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
          return user;
        }
        return null;
    }

    // Расшифровка токена
    async getUserData(token: string): Promise<User | null>{
        const user : User = await this.jwtService.decode(token)
        const oldUser : User = await this.loginService.findByUsername(user.username)
        user.avatar = oldUser.avatar
        user.friends = oldUser.friends
        user.email = oldUser.email
        user.conferences = oldUser.conferences
        return user
    }

    // Генерация токена
    async login(user: User) {
        const payload = { username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
