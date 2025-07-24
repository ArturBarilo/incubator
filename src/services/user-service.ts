import { CreateUserModel } from "../models/user/input/create-user-model";
import bcrypt from "bcrypt"
import { UserRepository } from "../repositories/user-repository";
import { UserQueryRepository } from "../repositories/user-query-repository";
import { usersCollection } from "../db/db";
import { ObjectId } from "mongodb";
import {UserAccountDb} from "../models/user/db/user-db";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";

export class UserService {
    static async createUserByAdmin(createUserModel: CreateUserModel) {
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
                isConfirmed: true,
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 1, minutes: 3}),
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

    static async getUserById(userId: string) {
        const user = await usersCollection.findOne({_id: new ObjectId(userId)})
        if (!user) return null

        return user
    }

    static async deleteUser(userId: string) {
        const user = await UserQueryRepository.getUserById(userId)

        if (!user) return null

        return await UserRepository.deleteUser(userId)//
    }


}