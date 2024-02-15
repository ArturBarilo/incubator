import { usersCollection } from "../db/db";
import { UserDb } from "../models/user/db/user-db";

export class UserRepository {
    static async createUser(createData: UserDb): Promise<string> {
        const res = await usersCollection.insertOne(createData)

        return res.insertedId.toString()
    }
}