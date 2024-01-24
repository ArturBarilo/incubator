import { Router } from "express";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../validators/blog-validators";
import { BlogRepository } from "../repositories/blog-repository";
import { Request, Response } from "express";
import { OutputBlogType } from "../models/blog/output/blog-output-models";
import { ObjectId } from "mongodb";
import { BlogDb } from "../models/blog/db/blog-db";
import { RequestWithQuery } from "../common";
import { QueryBlogInputModel } from "../models/blog/input/query-blog-input-model";
import { BlogQueryRepository } from "../repositories/blog-query-repository";


export const blogRoute = Router({})

export type UpdateBlogType = {
    name: string,
    description: string,
    websiteUrl: string
}

blogRoute.get('/', async (req: RequestWithQuery<QueryBlogInputModel>, res: Response<OutputBlogType[]>) => {
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

blogRoute.post('/', authMiddleware, blogValidation(), async (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body

    const newBlog: BlogDb = {
        name,
        description,
        websiteUrl,
        createdAt: (new Date()).toISOString(),
        isMembership: false
    }

    const createdBlogId = await BlogRepository.createBlog(newBlog)

    const blog = await BlogQueryRepository.getById(createdBlogId)

    if(!blog) {
        res.sendStatus(404)
        return
    }

    res.status(201).send(blog)
    return
})

blogRoute.put('/:id', authMiddleware, blogValidation(), async (req: Request, res: Response) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const blog = await BlogQueryRepository.getById(id)

    if(!blog) {
        res.sendStatus(404)
        return
    }

    const infoForUpdateBlog: UpdateBlogType = req.body

    const updatedBlog = await BlogRepository.updateBlog(id, infoForUpdateBlog)

    if (!updatedBlog) {
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

    const blog = await BlogQueryRepository.getById(id)

    if(!blog) {
        res.sendStatus(404)
        return
    }

    const deletedBlog = await BlogRepository.deleteBlog(id)

    if (!deletedBlog) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
    return
})