import { WithId } from "mongodb";
import { CommentDb } from "../db/comment-db";
import { CommentOutputModel } from "../output/output-comment-model";

export const commentMapper = (comment: WithId<CommentDb>): CommentOutputModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}