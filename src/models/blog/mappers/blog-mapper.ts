import { WithId } from "mongodb"
import { BlogDb } from "../db/blog-db"
import { OutputBlogType } from "../output/blog-output-models"

export const blogMapper = (blog: WithId<BlogDb>): OutputBlogType => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}
