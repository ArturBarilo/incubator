import { ObjectId } from "mongodb";
import { commentsCollection } from "../db/db";
import { CommentDb } from "../models/comment/db/comment-db";
import { CreateCommentModel } from "../models/comment/input/create-comment-model";

export class CommentRepository {
    static async createComment(comment: CommentDb) {
        const res = await commentsCollection.insertOne(comment) 

        return res.insertedId.toString()
    }

    static async deleteComment(id: string) {
        const res = await commentsCollection.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount.toString() 
    }

    static async updateComment(commentId: string, content: string) {
        const res = await commentsCollection.updateOne({_id: new ObjectId(commentId)}, {
            $set: {
                content
            }
        })

        return !!res.matchedCount
    }
}