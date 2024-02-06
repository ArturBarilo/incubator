import { BlogDb } from "../models/blog/db/blog-db"
import { CreateBlogModel } from "../models/blog/input/create-blog-model"
import { CreatePostFromBlogInputModel } from "../models/blog/input/create-post-from-blog-input-model"
import { OutputBlogType } from "../models/blog/output/blog-output-models"
import { PostDb } from "../models/post/db/post-db"
import { OutputPostType } from "../models/post/output/post-output-models"
import { BlogQueryRepository } from "../repositories/blog-query-repository"
import { BlogRepository } from "../repositories/blog-repository"
import { PostQueryRepository } from "../repositories/post-query-repository"
import { PostRepository } from "../repositories/post-repository"
import { UpdateBlogType } from "../routes/blog-route"

export class BlogService {

    static async createPostToBlog(blogId: string, createPostModel: CreatePostFromBlogInputModel): Promise<OutputPostType | null> {
        const { title, shortDescription, content} = createPostModel
        const blog = await BlogRepository.getById(blogId)

        if(!blog) {
            return null
        }

        const newPost: PostDb = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        const createdPostId = await PostRepository.createPost(newPost)

        if(!createdPostId) {
            return null
        }

        const post = await PostQueryRepository.getById(createdPostId)

        if(!post) {
            return null
        }

        return post
    }

    static async createBlog(createBlogModel: CreateBlogModel): Promise<OutputBlogType | null> {
        const { name, websiteUrl, description} = createBlogModel

        const newBlog: BlogDb = {
            name,
            description,
            websiteUrl,
            createdAt: (new Date()).toISOString(),
            isMembership: false
        }

        const createdBlogId = await BlogRepository.createBlog(newBlog)

        if(!createdBlogId) {
            return null
        }

        const blog = await BlogQueryRepository.getById(createdBlogId)

        if(!blog) {
            return null
        }

        return blog
    }

    static async updateBlog(blogId: string, updateBlogModel: UpdateBlogType): Promise<boolean | null> {
        const blog = await BlogQueryRepository.getById(blogId)

        if(!blog) {
            return null
        }

        return await BlogRepository.updateBlog(blogId, updateBlogModel)
    }

    static async deleteBlog(blogId: string): Promise<boolean | null> {
        const blog = await BlogQueryRepository.getById(blogId)

        if(!blog) {
            return null
        }

        return await BlogRepository.deleteBlog(blogId)
    }
}