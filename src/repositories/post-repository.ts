import { postsCollection } from "../db/db";
import { postMapper } from "../models/post/mappers/post-mapper";
import { OutputPostType } from "../models/post/output/post-output-models";
import { UpdatePostType } from "../routes/post-route";
import { BlogRepository } from "./blog-repository";
import { PostDb } from "../models/post/db/post-db";
import { ObjectId } from "mongodb";


export class PostRepository {

    static async getAll(): Promise<OutputPostType[]> {
        const posts = await postsCollection.find({}).toArray()

        return posts.map(postMapper)
    }

    static async getById(id: string): Promise<OutputPostType | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})

        if (!post) {
            return null
        }

        return postMapper(post)
    }

    static async createPost(createData: PostDb): Promise<string> {
        const res = await postsCollection.insertOne(createData)

        return res.insertedId.toString()
    }

    static async updatePost(id: string, infoForUpdatePost: UpdatePostType): Promise<boolean> {
        const blog = await BlogRepository.getById(infoForUpdatePost.blogId)

        if(blog) {
            const res = await postsCollection.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    title: infoForUpdatePost.title,
                    shortDescription: infoForUpdatePost.shortDescription,
                    content: infoForUpdatePost.content,
                    blogId: infoForUpdatePost.blogId,
                    blogName: blog.name
                }
            })

            return !!res.matchedCount
        }
        return false
    }

    static async deletePost(id: string): Promise<boolean> {
        const res = await postsCollection.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount.toString()
    }
}