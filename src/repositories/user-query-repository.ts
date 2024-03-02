import { ObjectId, SortDirection } from "mongodb";
import { usersCollection } from "../db/db";
import { userMapper } from "../models/user/mapper/user-mapper";
import { OutputUserType } from "../models/user/output/user-output-model";

type SortData = {
    sortBy: string
    sortDirection: SortDirection
    pageNumber: number
    pageSize: number
    searchLoginTerm: string | null
    searchEmailTerm: string | null
}

export class UserQueryRepository {
    static async getAll(sortData: SortData) {
        const { sortBy, sortDirection, searchEmailTerm, searchLoginTerm, pageNumber, pageSize } = sortData

        const filter = {
            $or: [
                { 'email': { $regex: searchEmailTerm ?? '', $options: 'i' } },
                { 'login': { $regex: searchLoginTerm ?? '', $options: 'i' } },
            ],
        };

        const users = await usersCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await usersCollection.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(userMapper)
        }

    }

    static async getUserById(id: string): Promise<OutputUserType | null> {
        const user = await usersCollection.findOne({ _id: new ObjectId(id) })

        if (!user) return null

        return userMapper(user)
    }
}