import { usersCollection } from "../db/db";
import { UserAccountDb, UserDb } from "../models/user/db/user-db";
import { ObjectId } from "mongodb";
import { userMapper } from "../models/user/mapper/user-mapper";
import { WithId } from "mongodb"

export class UserRepository {
    static async createUser(createData: UserAccountDb): Promise<string> {
        const res = await usersCollection.insertOne(createData)

        return res.insertedId.toString()
    }

    static async createUserAccount(createData: UserAccountDb): Promise<string> {
        const res = await usersCollection.insertOne(createData)

        return res.insertedId.toString()
    }

    static async deleteUser(id: string): Promise<boolean> {
        const res = await usersCollection.deleteOne({ _id: new ObjectId(id) })

        return !!res.deletedCount.toString()
    }

    static async findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserAccountDb> | null> {
        const user = await usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] })
        
        if (!user) return null

        return user
    }

    static async checkingUniqueLogin(login: string): Promise<boolean> {
        const notUniqueLogin = await usersCollection.findOne({login: login})

        if(notUniqueLogin) return false

        return true
    }

    static async checkingUniqueEmail(email: string): Promise<boolean> {
        const notUniqueEmail = await usersCollection.findOne({email: email})

        if(notUniqueEmail) return false

        return true
    }
}