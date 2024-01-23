"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const blog_mapper_1 = require("../models/blog/mappers/blog-mapper");
class BlogRepository {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield db_1.blogsCollection.find({}).toArray();
            return blogs.map(blog_mapper_1.blogMapper);
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!blog) {
                return null;
            }
            return (0, blog_mapper_1.blogMapper)(blog);
        });
    }
    static createBlog(createData) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.blogsCollection.insertOne(createData);
            return res.insertedId.toString();
        });
    }
    static updateBlog(id, infoForUpdateBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    name: infoForUpdateBlog.name,
                    description: infoForUpdateBlog.description,
                    websiteUrl: infoForUpdateBlog.websiteUrl
                }
            });
            return !!res.matchedCount;
        });
    }
    static deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return !!res.deletedCount.toString();
        });
    }
}
exports.BlogRepository = BlogRepository;
