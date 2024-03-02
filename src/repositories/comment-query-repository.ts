import { ObjectId, SortDirection } from "mongodb";
import { commentsCollection, postsCollection } from "../db/db";
import { commentMapper } from "../models/comment/mappers/comment-mapper";
import { CommentOutputModel } from "../models/comment/output/output-comment-model";
import { Pagination } from "../common";

type SortData = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
    postId: string
}

export class CommentQueryRepository {

    static async getCommentById(commentId: string) {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) })
        
        if (!comment) return null

        return commentMapper(comment)
    }

    static async getAllComments(sortData: SortData): Promise<Pagination<CommentOutputModel>> {
        const { pageNumber, pageSize, sortBy, sortDirection, postId } = sortData

        const comments = await commentsCollection
            .find({postId: postId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await commentsCollection.countDocuments({postId: postId})

        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments.map(commentMapper)
        }
    }
}