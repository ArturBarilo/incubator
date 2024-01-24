import { ObjectId, SortDirection } from "mongodb";
import {blogsCollection } from "../db/db";
import { blogMapper } from "../models/blog/mappers/blog-mapper";
import { OutputBlogType } from "../models/blog/output/blog-output-models";


type SortData = {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: SortDirection
    pageNumber: number
    pageSize: number
}

export class BlogQueryRepository {

    static async getAll(sortData: SortData): Promise<OutputBlogType[]> {
        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = sortData

        let filter = {}

        if(searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }
        }

        const blogs = await blogsCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await blogsCollection.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / pageSize)

        return blogs.map(blogMapper)
    }

    static async getById(id: string): Promise<OutputBlogType | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})

        if (!blog) {
            return null
        }

        return blogMapper(blog)
    }
}