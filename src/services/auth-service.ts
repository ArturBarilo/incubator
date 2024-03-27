import { JWTService } from "../application/jwt-service";
import { usersCollection } from "../db/db";
import { UserAccountDb, UserDbWithId } from "../models/user/db/user-db";
import { CreateUserModel } from "../models/user/input/create-user-model";
import { userMapper } from "../models/user/mapper/user-mapper";
import { OutputUserTypeForMe } from "../models/user/output/user-output-model";
import { UserQueryRepository } from "../repositories/user-query-repository";
import { UserRepository } from "../repositories/user-repository";
import bcrypt from "bcrypt";

export class AuthService {
    static async createUser(createUserModel: CreateUserModel) {
        const { login, email, password } = createUserModel

        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserAccountDb = {
            accountData: {
                userName: login,
                email: email,
                password: passwordHash,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation: {
                isConfirmed: false,
                confirmationCode: 'qwrwre',
                expirationDate: Date,
            }
        }

        const createdUserId = await UserRepository.createUser(newUser)

        const user = await UserQueryRepository.getUserById(createdUserId)

        if (!user) return null

        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }

    static async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }

    static async login(loginOrEmail: string, password: string) {
        const user = await UserRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return false

        const checkingPassword = await bcrypt.compare(password, user.accountData.password)

        if (!checkingPassword) return false

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
