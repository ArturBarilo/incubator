"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const db_1 = require("../db/db");
class BlogRepository {
    static getById(id) {
        return db_1.db.blogs.find((b) => b.id == id);
    }
    static getAll() {
        return db_1.db.blogs;
    }
    static createBlog(createData) {
        db_1.db.blogs.push(createData);
        return createData;
    }
    static updateBlog(id, infoForUpdateBlog) {
        const blogForUpdate = db_1.db.blogs.find((b) => b.id == id);
        if (blogForUpdate) {
            blogForUpdate.name = infoForUpdateBlog.name;
            blogForUpdate.description = infoForUpdateBlog.description;
            blogForUpdate.websiteUrl = infoForUpdateBlog.websiteUrl;
            return true;
        }
        else {
            return false;
        }
    }
    static deleteBlog(id) {
        const blogIndex = db_1.db.blogs.findIndex(b => b.id == id);
        if (blogIndex < 0) {
            return false;
        }
        else {
            db_1.db.blogs.splice(blogIndex, 1);
            return true;
        }
    }
}
exports.BlogRepository = BlogRepository;
