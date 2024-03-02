import { JWTService } from "../application/jwt-service";
import { usersCollection } from "../db/db";
import { UserDbWithId } from "../models/user/db/user-db";
import { userMapper } from "../models/user/mapper/user-mapper";
import { OutputUserTypeForMe } from "../models/user/output/user-output-model";
import {UserRepository} from "../repositories/user-repository";
import bcrypt from "bcrypt";

export class AuthService {
    static async login(loginOrEmail: string, password: string) {
        const user = await UserRepository.findUserByLoginOrEmail(loginOrEmail)

        if(!user) return false

        const checkingPassword = await bcrypt.compare(password, user.password)

        if(!checkingPassword) return false

        return user
    }

    static getInfoAboutCerrentUser(userFromReq: UserDbWithId) {
        const currentUser: OutputUserTypeForMe = {
        email: userFromReq.email,
        login: userFromReq.login,
        userId: userFromReq._id.toString()
    }

    return currentUser
    }
}
