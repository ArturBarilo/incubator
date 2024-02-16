import { usersCollection } from "../db/db";
import { UserDb } from "../models/user/db/user-db";
import {ObjectId} from "mongodb";

export class UserRepository {
    static async createUser(createData: UserDb): Promise<string> {
        const res = await usersCollection.insertOne(createData)

        return res.insertedId.toString()
    }

    static async deleteUser(id: string): Promise<boolean> {
        const res = await usersCollection.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount.toString()
    }

    static async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDb | null> {
        const user = await usersCollection.findOne({$or: [ { email: loginOrEmail }, { login: loginOrEmail } ] })
        if(!user) return null
        return user
    }
}