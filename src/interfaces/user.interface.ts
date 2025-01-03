export interface IUser {
    username: string;
    email: string;
    password: string;
    avatar?: string
    friends?: string[]
    conferences?: number
    isAdmin: boolean
}