import { Router } from "express";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { BlogRepository } from "../repositories/blog-repository";
import { Request, Response } from "express";
import { PostRepository } from "../repositories/post-repository";
import { postValidation } from "../validators/post-validators";
import { OutputPostType } from "../models/post/output/post-output-models";
import { ObjectId } from "mongodb";
import { PostDb } from "../models/post/db/post-db";


export const postRoute = Router({})

export type UpdatePostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

postRoute.get('/', async (req: Request, res: Response<OutputPostType[]>) => {
    const posts = await PostRepository.getAll()

    res.status(200).send(posts)
    return
})

postRoute.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const post = await PostRepository.getById(id)

    if (!post) {
        res.sendStatus(404)
        return
    }

    res.status(200).send(post)
})

postRoute.post('/', authMiddleware, postValidation(), async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body
    const blogName = await BlogRepository.getById(blogId)

    if(blogName) {
        const newPost: PostDb = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogName.name,
            createdAt: (new Date()).toISOString()
        }
        const createdPostId = await PostRepository.createPost(newPost)

        const post = await PostRepository.getById(createdPostId)

        if(!post) {
            res.sendStatus(404)
            return
        }
        res.status(201).send(post)
        return
    }

    res.sendStatus(404)
    return
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req: Request, res: Response) => {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
        res.sendStatus(404)
        return
    }

    const post = await PostRepository.getById(id)

    if(!post) {
        res.sendStatus(404)
        return
    }

    const infoForUpdatePost: UpdatePostType = req.body

    const updatedPost = await PostRepository.updatePost(id, infoForUpdatePost)

    if (!updatedPost) {
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

    const existingPost = await PostRepository.getById(id)

    if(!existingPost) {
        res.sendStatus(404)
        return
    }

    const post = await PostRepository.deletePost(id)

    if (!post) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
    return
})