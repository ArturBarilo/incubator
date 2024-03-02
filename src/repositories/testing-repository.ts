import {blogsCollection, commentsCollection, database, postsCollection, usersCollection} from "../db/db"
import {Collection} from "mongodb";


export class TestingRepository {

    static async deleteAll() {
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
        await usersCollection.deleteMany({})
        await commentsCollection.deleteMany({})

        // await database.dropDatabase()
        return
    }
    
}