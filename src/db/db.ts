import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import { BlogDb } from "../models/blog/db/blog-db";
import { PostDb } from '../models/post/db/post-db';
import { UserDb } from '../models/user/db/user-db';

dotenv.config()

export const port = 80

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017'

const client = new MongoClient(uri)

console.log(`Mongodb start on ${process.env.MONGO_URL}`)

export const database = client.db('blogs-db')

export const blogsCollection = database.collection<BlogDb>('blogs')

export const postsCollection = database.collection<PostDb>('posts')

export const usersCollection = database.collection<UserDb>('users')

export const runDb = async () => {
    try {
        await client.connect()

        console.log('Client connect to DB')
        console.log(`App listen on port: ${port}`)
    }catch(e){
        console.log(e)

        await client.close()
    }

}
