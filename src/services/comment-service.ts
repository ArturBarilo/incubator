import { ObjectId } from "mongodb";
import { commentsCollection } from "../db/db";
import { CommentDb } from "../models/comment/db/comment-db";
import { CreateCommentModel } from "../models/comment/input/create-comment-model";
import { CommentQueryRepository } from "../repositories/comment-query-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { UserService } from "./user-service";

export class CommentServise {
    static async createComment(content: string, userId: string, postId: string) {
        const user = await UserService.getUserById(userId)

        if(!user) return null 

        const newComment: CommentDb = {
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.accountData.email
            },
            createdAt: new Date().toISOString(),
            postId: postId
        }

        const createdCommentId = await CommentRepository.createComment(newComment)

        const comment = await CommentQueryRepository.getCommentById(createdCommentId)

        if(!comment) return null

        return comment
    }

    static async deleteComment(userId: string, commentId: string) {
        const comment = await commentsCollection.findOne({_id: new ObjectId(commentId)})

        if(!comment) return null

        if(userId !== comment.commentatorInfo.userId) return 'comment by other user'

        return CommentRepository.deleteComment(commentId)
    }

    static async updateComment(commentId: string, content: string) {
        return CommentRepository.updateComment(commentId, content)

    }
}