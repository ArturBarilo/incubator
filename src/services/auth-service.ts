import {UserRepository} from "../repositories/user-repository";
import bcrypt from "bcrypt";

export class AuthService {
    static async login(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await UserRepository.findUserByLoginOrEmail(loginOrEmail)

        if(!user) return false

        const checkingPassword = await bcrypt.compare(password, user.password)

        if(!checkingPassword) return false

        return true
    }
}