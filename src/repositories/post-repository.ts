import { db } from "../db/db";
import { PostType, UpdatePostType } from "../routes/post-route";
import { BlogRepository } from "./blog-repository";


export class PostRepository {

    static getById(id: string) {
        return db.posts.find((p) => p.id == id)
    }

    static getAll() {
        return db.posts
    }

    static createPost(createData: PostType) {
        db.posts.push(createData)

        return createData
    }

    static updatePost(id: string, infoForUpdatePost: UpdatePostType) {

        const postForUpdate = db.posts.find((p) => p.id == id)

        const blog = BlogRepository.getById(infoForUpdatePost.blogId)

        if (postForUpdate && blog) {
            postForUpdate.title = infoForUpdatePost.title
            postForUpdate.shortDescription = infoForUpdatePost.shortDescription
            postForUpdate.content = infoForUpdatePost.content
            postForUpdate.blogId = infoForUpdatePost.blogId
            postForUpdate.blogName = blog.name

            return true
        } else {
            return false
        }

    }

    static deletePost(id: string) {

        const postIndex = db.posts.findIndex(p => p.id == id)

        if (postIndex < 0) {
            return false
        } else {
            db.posts.splice(postIndex, 1)
            return true
        }
    }

}