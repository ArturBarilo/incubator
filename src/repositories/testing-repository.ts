import { blogsCollection, database, postsCollection } from "../db/db"


export class TestingRepository {

    static async deleteAll() {
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})

        // await database.dropDatabase()
        return
    }
    
}