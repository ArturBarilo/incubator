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

    static async updateConfirmation(_id: ObjectId) {
        let result = await usersCollection
            .updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }

    static async deleteUser(id: string): Promise<boolean> {
        const res = await usersCollection.deleteOne({ _id: new ObjectId(id) })

        return !!res.deletedCount.toString()
    }
    static async deleteUserByEmail(email: string): Promise<boolean> {
        const res = await usersCollection.deleteOne({ 'accountData.email': email })

        return !!res.deletedCount.toString()
    }

    static async findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserAccountDb> | null> {
        const user = await usersCollection.findOne(
            { $or: [{ 'accountData.userName': loginOrEmail }, { 'accountData.email': loginOrEmail }] })

        if (!user) return null

        return user
    }

    static async checkingUniqueLogin(login: string): Promise<boolean> {
        const checkingUniqueLogin = await usersCollection.findOne(
            {"accountData.userName": login})

        if(checkingUniqueLogin) return false

        return true
    }

    static async checkingUniqueEmail(email: string): Promise<boolean> {
        const checkingUniqueEmail = await usersCollection.findOne({"accountData.email": email})

        if(checkingUniqueEmail) return false

        return true
    }

    static async updateCodeForResendingEmail(email: string, newCode: string) {
        let result = await usersCollection
            .updateOne({"accountData.email": email}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.modifiedCount === 1
    }
}