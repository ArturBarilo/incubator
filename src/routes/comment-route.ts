import { Router } from "express";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { CommentQueryRepository } from "../repositories/comment-query-repository";
import { jwtAuthMiddleware } from "../middlewares/auth/jwt-auth-middleware";
import { CommentServise } from "../services/comment-service";
import { ParamType, RequestWithBody, RequestWithParamsAndBody } from "../common";
import { CreateCommentModel } from "../models/comment/input/create-comment-model";
import { commentValidation } from "../validators/comment-validators";
import { CommentRepository } from "../repositories/comment-repository";
import { CommentOutputModel } from "../models/comment/output/output-comment-model";

export const commentRoute = Router({})

commentRoute.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) return res.sendStatus(404)

    const comment = await CommentQueryRepository.getCommentById(id)

    if(!comment) return res.sendStatus(404)

    res.status(200).send(comment)
    return
})

commentRoute.delete('/:commentId', jwtAuthMiddleware, async (req: Request, res: Response) => {
    const commentId = req.params.commentId

    if(!ObjectId.isValid(commentId)) return res.sendStatus(404)

    const userId = req.user._id.toString()

    const toDeleteComment = await CommentServise.deleteComment(userId, commentId)

    if(!toDeleteComment) return res.sendStatus(404)

    if(toDeleteComment === 'comment by other user') return res.sendStatus(403)

    res.status(204).send(toDeleteComment)
    return 

})

commentRoute.put('/:id', jwtAuthMiddleware, commentValidation(), async (req: RequestWithParamsAndBody<ParamType, CreateCommentModel>, res: Response) => {
    const commentId = req.params.id

    if(!ObjectId.isValid(commentId)) return res.sendStatus(404)
    
    const content = req.body.content

    const userId = req.user._id.toString()

    const comment = await CommentQueryRepository.getCommentById(commentId)
    
    if(!comment) return res.sendStatus(404)

    if(userId !== comment.commentatorInfo.userId) return res.sendStatus(403)

    const commentIsUpdated = await CommentRepository.updateComment(commentId, content)

    if(!commentIsUpdated) return res.sendStatus(404)

    res.sendStatus(204)
    return
})