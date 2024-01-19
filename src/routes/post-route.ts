import { Router } from "express";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { BlogRepository } from "../repositories/blog-repository";
import { Request, Response } from "express";
import { PostRepository } from "../repositories/post-repository";
import { postValidation } from "../validators/post-validators";


export const postRoute = Router({})

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export type UpdatePostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

postRoute.get('/', (req, res) => {
    const posts = PostRepository.getAll()

    res.status(200).send(posts)
    return
    
})

postRoute.get('/:id', (req: Request, res: Response) => {

    const id = req.params.id

    const post = PostRepository.getById(id)
    if (post) {
        res.send(post)
        return
    } else {
        res.sendStatus(404)
        return
    }

})

postRoute.post('/', authMiddleware, postValidation(), (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body
    const blogName = BlogRepository.getById(blogId)

    if(blogName) {

        const newPost: PostType = {
            id: (new Date()).toISOString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogName.name
        }
        const createdPost = PostRepository.createPost(newPost)
        res.status(201).send(createdPost)
        return
    }
    
})

postRoute.put('/:id', authMiddleware, postValidation(), (req: Request, res: Response) => {

    const id = req.params.id

    const infoForUpdatePost: UpdatePostType = req.body

    const updatedPost = PostRepository.updatePost(id, infoForUpdatePost)

    if (updatedPost) {
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
        return
    }

})

postRoute.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    const id = req.params.id

    const deletedPost = PostRepository.deletePost(id)

    if (deletedPost) {
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
        return
    }
})