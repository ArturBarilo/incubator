import { CreateUserModel } from "../models/user/input/create-user-model";
import bcrypt from "bcrypt"
import { UserRepository } from "../repositories/user-repository";
import { UserQueryRepository } from "../repositories/user-query-repository";

export class UserService {
    static async createUser(createUserModel: CreateUserModel) {
        const { login, email, password } = createUserModel

        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser = {
            login: login,
            email: email,
            password: passwordHash,
            createdAt: new Date().toISOString()
        }

        const createdUserId = await UserRepository.createUser(newUser)

        const user = await UserQueryRepository.getUserById(createdUserId)

        if(!user) return null

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

    static async deleteUser(userId: string) {
        const user = await UserQueryRepository.getUserById(userId)

        if(!user) return null

        return await UserRepository.deleteUser(userId)
    }
}