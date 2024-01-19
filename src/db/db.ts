import { BlogType } from "../routes/blog-route";
import { PostType } from "../routes/post-route";

// export const db: BlogType[] = []

type DB = {
    blogs: BlogType[]
    posts: PostType[]
}

export const db: DB = {
    blogs: [],
    posts: []
}