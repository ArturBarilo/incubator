import { db } from "../db/db";
import { BlogType, UpdateBlogType } from "../routes/blog-route";


export class BlogRepository {

    static getById(id: string) {
        return db.blogs.find((b) => b.id == id)
    }

    static getAll() {
        return db.blogs
    }

    static createBlog(createData: BlogType) {
        db.blogs.push(createData)

        return createData
    }

    static updateBlog(id: string, infoForUpdateBlog: UpdateBlogType) {

        const blogForUpdate = db.blogs.find((b) => b.id == id)

        if (blogForUpdate) {
            blogForUpdate.name = infoForUpdateBlog.name
            blogForUpdate.description = infoForUpdateBlog.description
            blogForUpdate.websiteUrl = infoForUpdateBlog.websiteUrl
            return true
        } else {
            return false
        }

    }


    static deleteBlog(id: string) {

        const blogIndex = db.blogs.findIndex(b => b.id == id)

        if (blogIndex < 0) {
            return false
        } else {
            db.blogs.splice(blogIndex, 1)
            return true
        }
    }

}