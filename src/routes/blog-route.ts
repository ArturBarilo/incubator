import { Router } from "express";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../validators/blog-validators";
import { BlogRepository } from "../repositories/blog-repository";
import { Request, Response } from "express";
import { OutputBlogType } from "../models/blog/output/blog-output-models";
import { ObjectId } from "mongodb";
import { BlogDb } from "../models/blog/db/blog-db";
import {ParamType, RequestWithBody, RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery } from "../common";
import { QueryBlogInputModel } from "../models/blog/input/query-blog-input-model";
import { BlogQueryRepository } from "../repositories/blog-query-repository";
import { Pagination } from "../common";
import { createPostFromBlogValidation } from "../validators/post-validators";
import { CreatePostFromBlogInputModel } from "../models/blog/input/create-post-from-blog-input-model";
import { PostDb } from "../models/post/db/post-db";
import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/post-query-repository";
import { OutputPostType } from "../models/post/output/post-output-models";
import { BlogService } from "../services/blog-service";
import { CreateBlogModel } from "../models/blog/input/create-blog-model";
import { QueryPostInputModel } from "../models/post/input/query-post-input-model";


export const blogRoute = Router({})

export type UpdateBlogType = {
    name: string,
    description: string,
    websiteUrl: string
}

blogRoute.get('/', async (req: RequestWithQuery<QueryBlogInputModel>, res: Response<Pagination<OutputBlogType>>) => {
    const sortData = {
        searchNameTerm: req.query.searchNameTerm ?? null,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    }

    const blogs = await BlogQueryRepository.getAll(sortData)

    res.status(200).send(blogs)
})

blogRoute.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const blog = await BlogQueryRepository.getById(id)

    if (!blog) {
        res.sendStatus(404)
        return
    }

    res.status(200).send(blog)
})

blogRoute.get('/:id/posts', async (req: RequestWithParamsAndQuery<ParamType, QueryPostInputModel>, res: Response<Pagination<OutputPostType>>) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const sortData = {
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        blogId: id
    }

    const posts = await BlogQueryRepository.getPostsToBlog(sortData)

    if(!posts) {
        return res.sendStatus(404)
    }

    res.status(200).send(posts)
    return
})

blogRoute.post('/', authMiddleware, blogValidation(), async (req: Request, res: Response) => {
    const createBlogModel: CreateBlogModel = req.body

    const blog = await BlogService.createBlog(createBlogModel)

    if(!blog) {
        res.sendStatus(404)
        return
    }
    
    res.status(201).send(blog)
})

blogRoute.post('/:id/posts', authMiddleware, createPostFromBlogValidation(), async (req: RequestWithParamsAndBody<ParamType, CreatePostFromBlogInputModel>, res: Response<OutputPostType>) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const createPostFromBlogModel = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content
    }

    const post = await BlogService.createPostToBlog(id, createPostFromBlogModel)

    if(!post) {
        res.sendStatus(404)
        return
    }

    res.status(201).send(post)
})

blogRoute.put('/:id', authMiddleware, blogValidation(), async (req: Request, res: Response) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const infoForUpdateBlog: UpdateBlogType = req.body

    const blogIsUpdated = await BlogService.updateBlog(id, infoForUpdateBlog)

    if(!blogIsUpdated) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
    return
})

blogRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const deletedBlog = await BlogService.deleteBlog(id)

    if(!deletedBlog) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
    return
})