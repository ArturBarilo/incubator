import { Router } from "express";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { BlogRepository } from "../repositories/blog-repository";
import { Request, Response } from "express";
import { PostRepository } from "../repositories/post-repository";
import { postValidation } from "../validators/post-validators";
import { OutputPostType } from "../models/post/output/post-output-models";
import { ObjectId } from "mongodb";
import { PostDb } from "../models/post/db/post-db";
import { BlogQueryRepository } from "../repositories/blog-query-repository";
import { PostQueryRepository } from "../repositories/post-query-repository";
import { PostService } from "../services/post-service";
import { CreatePostModel } from "../models/post/input/create-post-model";
import {Pagination, ParamType, RequestWithBody, RequestWithParamsAndBody, RequestWithQuery, RequestWithParamsAndQuery } from "../common";
import { QueryPostInputModel } from "../models/post/input/query-post-input-model";
import { OutputBlogType } from "../models/blog/output/blog-output-models";
import { commentValidation } from "../validators/comment-validators";
import { jwtAuthMiddleware } from "../middlewares/auth/jwt-auth-middleware";
import { CommentServise } from "../services/comment-service";
import { QueryCommentInputModel } from "../models/comment/input/query-comment-input-model";
import { CommentQueryRepository } from "../repositories/comment-query-repository";
import { CreateCommentModel } from "../models/comment/input/create-comment-model";
import { CommentOutputModel } from "../models/comment/output/output-comment-model";


export const postRoute = Router({})

export type UpdatePostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

postRoute.get('/:id/comments', async (req:RequestWithParamsAndQuery<ParamType, QueryCommentInputModel>, res) => {
    const postId = req.params.id

    if(!ObjectId.isValid(postId)) return res.sendStatus(404)

    const post = await PostQueryRepository.getById(postId)

    if(!post) return res.sendStatus(404)

    const sortData = {
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        postId: postId
    }

    const comments = await CommentQueryRepository.getAllComments(sortData)

    res.status(200).send(comments)
    return
})

postRoute.post('/:id/comments', jwtAuthMiddleware, commentValidation(), async(req:RequestWithParamsAndBody<ParamType,CreateCommentModel>, res: Response<CommentOutputModel>) => {
    const postId = req.params.id

    if(!ObjectId.isValid(postId)) return res.sendStatus(404)

    const post = await PostQueryRepository.getById(postId)

    if(!post) return res.sendStatus(404)

    const newComment = await CommentServise.createComment(req.body.content, req.user!._id.toString(), postId)

    if(!newComment) return res.sendStatus(404)

    return res.status(201).send(newComment)  
    
})

postRoute.get('/', async (req: RequestWithQuery<QueryPostInputModel>, res: Response<Pagination<OutputPostType>>) => {
    const sortData = {
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    }

    const posts = await PostQueryRepository.getAll(sortData)

    res.status(200).send(posts)
})

postRoute.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const post = await PostQueryRepository.getById(id)

    if (!post) {
        res.sendStatus(404)
        return
    }

    res.status(200).send(post)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: Request, res: Response) => {
    const createPostModel: CreatePostModel = req.body

    const post = await PostService.createPost(createPostModel)

    if(!post) {
        res.sendStatus(404)
        return
    }
    
    res.status(201).send(post)
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req: Request, res: Response) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }
    
    const infoForUpdatePost: UpdatePostType = req.body
    
    const postIsUpdated = await PostService.updatePost(id, infoForUpdatePost)

    if(!postIsUpdated) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
    return
})

postRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const deletedPost = await PostService.deletePost(id)

    if(!deletedPost) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
    return
})