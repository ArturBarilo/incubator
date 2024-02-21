import { PostDb } from "../models/post/db/post-db";
import { CreatePostModel } from "../models/post/input/create-post-model";
import { OutputPostType } from "../models/post/output/post-output-models";
import { BlogQueryRepository } from "../repositories/blog-query-repository";
import { PostQueryRepository } from "../repositories/post-query-repository";
import { PostRepository } from "../repositories/post-repository";
import { UpdatePostType } from "../routes/post-route";

export class PostService {
    
    static async createPost(createPostModel: CreatePostModel) {
        const {title, shortDescription, content, blogId} = createPostModel

        const blog = await BlogQueryRepository.getById(createPostModel.blogId)

        if(!blog) {
            return null
        }
        
        const newPost: PostDb = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
            createdAt: (new Date()).toISOString()
        }
        
        const createdPostId = await PostRepository.createPost(newPost)

        const post = await PostQueryRepository.getById(createdPostId)

        if(!post) {
            return null
        }
        
        return post
    }
    
    static async updatePost(postId: string, updatePostModel: UpdatePostType): Promise<boolean | null> {
        const post = await PostQueryRepository.getById(postId)
        
        if(!post) {
            return null
        }
        
        return PostRepository.updatePost(postId, updatePostModel)
    }
    
    static async deletePost(postId: string): Promise<boolean | null> {
        const post = PostQueryRepository.getById(postId)
        
        if(!post) {
            return null
        }
        
        return PostRepository.deletePost(postId)
    }
    
    
    
    
    
    
}
