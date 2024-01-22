import { BlogType } from "../routes/blog-route";
import { PostType } from "../routes/post-route";
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

dotenv.config()

export const port = 80

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017'

const client = new MongoClient(uri)

console.log(`mongodb start on ${process.env.MONGO_URL}`)

const database = client.db('blogs-db')

export const blogsCollection = database.collection('blogs')

export const postsCollection = database.collection('posts')

export const runDb = async () => {
    try {
        await client.connect()

        console.log('client connect to DB')
        console.log(`App listen on port: ${port}`)
    }catch(e){
        console.log(e)

        await client.close()
    }

}
