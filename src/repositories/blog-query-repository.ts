import { ObjectId, SortDirection } from "mongodb";
import { Pagination } from "../common";
import {blogsCollection, postsCollection } from "../db/db";
import { blogMapper } from "../models/blog/mappers/blog-mapper";
import { OutputBlogType } from "../models/blog/output/blog-output-models";
import { postMapper } from "../models/post/mappers/post-mapper";
import { OutputPostType } from "../models/post/output/post-output-models";


type SortData = {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: SortDirection
    pageNumber: number
    pageSize: number
}

type SortDataForPostsToBlog = {
    blogId: string
    sortBy: string
    sortDirection: SortDirection
    pageNumber: number
    pageSize: number
}

export class BlogQueryRepository {

    static async getAll(sortData: SortData): Promise<Pagination<OutputBlogType>> {
        const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = sortData

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

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs.map(blogMapper)
        }
    }

    static async getPostsToBlog(sortData: SortDataForPostsToBlog): Promise<Pagination<OutputPostType> | null> {
        const {sortBy, sortDirection, pageNumber, pageSize, blogId} = sortData

        const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)})

        if (!blog) {
            return null
        }

        const filter = {blogId: blogId}

        const posts = await postsCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }

    static async getById(id: string): Promise<OutputBlogType | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})

        if (!blog) {
            return null
        }

        return blogMapper(blog)
    }
}