import { JWTService } from "../application/jwt-service";
import { usersCollection } from "../db/db";
import { userMapper } from "../models/user/mapper/user-mapper";
import {UserRepository} from "../repositories/user-repository";
import bcrypt from "bcrypt";

export class AuthService {
    static async login(loginOrEmail: string, password: string) {
        const user = await UserRepository.findUserByLoginOrEmail(loginOrEmail)

        if(!user) return false

        const checkingPassword = await bcrypt.compare(password, user.password)

        if(!checkingPassword) return false

        const token = JWTService.createJWT(user._id.toString())

        return token
    }
}