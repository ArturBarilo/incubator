import { postsCollection } from "../db/db";
import { postMapper } from "../models/post/mappers/post-mapper";
import { OutputPostType } from "../models/post/output/post-output-models";
import { UpdatePostType } from "../routes/post-route";
import { BlogRepository } from "./blog-repository";
import { PostDb } from "../models/post/db/post-db";
import { ObjectId, SortDirection } from "mongodb";
import { BlogQueryRepository } from "./blog-query-repository";
import { Pagination } from "../common";

type SortDataForAllPosts = {
    sortBy: string
    sortDirection: SortDirection
    pageNumber: number
    pageSize: number
}

export class PostQueryRepository {

    static async getAll(sortData: SortDataForAllPosts): Promise<Pagination<OutputPostType>> {
        const { pageNumber, sortBy, sortDirection, pageSize } = sortData

        const posts = await postsCollection
            .find({})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments()

        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }

    static async getById(id: string): Promise<OutputPostType | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})

        if (!post) {
            return null
        }

        return postMapper(post)
    }
}