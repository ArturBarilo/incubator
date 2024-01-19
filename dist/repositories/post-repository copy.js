"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const db_1 = require("../db/db");
const blog_repository_1 = require("./blog-repository");
class PostRepository {
    static getById(id) {
        return db_1.db.posts.find((p) => p.id == id);
    }
    static getAll() {
        return db_1.db.posts;
    }
    static createPost(createData) {
        db_1.db.posts.push(createData);
        return createData;
    }
    static updatePost(id, infoForUpdatePost) {
        const postForUpdate = db_1.db.posts.find((p) => p.id == id);
        const blog = blog_repository_1.BlogRepository.getById(infoForUpdatePost.blogId);
        if (postForUpdate && blog) {
            postForUpdate.title = infoForUpdatePost.title;
            postForUpdate.shortDescription = infoForUpdatePost.shortDescription;
            postForUpdate.content = infoForUpdatePost.content;
            postForUpdate.blogId = infoForUpdatePost.blogId;
            postForUpdate.blogName = blog.name;
            return true;
        }
        else {
            return false;
        }
    }
    //Профессиональный TypeScript. Разработка масштабируемых JavaScript-приложений борис чёрный
    static deletePost(id) {
        const postIndex = db_1.db.posts.findIndex(p => p.id == id);
        if (postIndex < 0) {
            return false;
        }
        else {
            db_1.db.posts.splice(postIndex, 1);
            return true;
        }
    }
}
exports.PostRepository = PostRepository;
