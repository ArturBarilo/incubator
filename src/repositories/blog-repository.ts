import { ObjectId } from "mongodb";
import {blogsCollection } from "../db/db";
import { BlogDb } from "../models/blog/db/blog-db";
import { blogMapper } from "../models/blog/mappers/blog-mapper";
import { OutputBlogType } from "../models/blog/output/blog-output-models";
import { UpdateBlogType } from "../routes/blog-route";


export class BlogRepository {

    static async getById(id: string): Promise<BlogDb | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})

        if (!blog) {
            return null
        }

        return blog
    }

    static async createBlog(createData: BlogDb): Promise<string> {
        const res = await blogsCollection.insertOne(createData)

        return res.insertedId.toString()
    }

    static async updateBlog(id: string, infoForUpdateBlog: UpdateBlogType): Promise<boolean> {
        const res = await blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: infoForUpdateBlog.name,
                description: infoForUpdateBlog.description,
                websiteUrl: infoForUpdateBlog.websiteUrl
            }
        })

        return !!res.matchedCount
    }

    static async deleteBlog(id: string): Promise<boolean> {
        const res = await blogsCollection.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount.toString()
    }
}