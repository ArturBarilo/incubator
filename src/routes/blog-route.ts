import { Router } from "express";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../validators/blog-validators";
import { BlogRepository } from "../repositories/blog-repository";
import { Request, Response } from "express";



export const blogRoute = Router({})

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export type UpdateBlogType = {
    name: string,
    description: string,
    websiteUrl: string
}

blogRoute.get('/', (req, res) => {
    const blogs = BlogRepository.getAll()

    res.status(200).send(blogs)
    return
})

blogRoute.get('/:id', (req: Request, res: Response) => {

    const id = req.params.id

    const blog = BlogRepository.getById(id)
    if (blog) {
        res.send(blog)
        return
    } else {
        res.sendStatus(404)
        return
    }
})

blogRoute.post('/', authMiddleware, blogValidation(), (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body

    const newBlog: BlogType = {
        id: (new Date()).toISOString(),
        name,
        description,
        websiteUrl
    }

    const createdBlog = BlogRepository.createBlog(newBlog)

    res.status(201).send(createdBlog)
    return

})

blogRoute.put('/:id', authMiddleware, blogValidation(), (req: Request, res: Response) => {

    const id = req.params.id

    const infoForUpdateBlog: UpdateBlogType = req.body

    const updatedBlog = BlogRepository.updateBlog(id, infoForUpdateBlog)

    if (updatedBlog) {
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
        return
    }

})

blogRoute.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    const id = req.params.id

    const deletedBlog = BlogRepository.deleteBlog(id)

    if (deletedBlog) {
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
        return
    }
})