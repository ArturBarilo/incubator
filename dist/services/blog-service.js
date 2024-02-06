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
exports.BlogService = void 0;
const blog_query_repository_1 = require("../repositories/blog-query-repository");
const blog_repository_1 = require("../repositories/blog-repository");
const post_query_repository_1 = require("../repositories/post-query-repository");
const post_repository_1 = require("../repositories/post-repository");
class BlogService {
    static createPostToBlog(blogId, createPostModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content } = createPostModel;
            const blog = yield blog_repository_1.BlogRepository.getById(blogId);
            if (!blog) {
                return null;
            }
            const newPost = {
                title,
                shortDescription,
                content,
                blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            const createdPostId = yield post_repository_1.PostRepository.createPost(newPost);
            if (!createdPostId) {
                return null;
            }
            const post = yield post_query_repository_1.PostQueryRepository.getById(createdPostId);
            if (!post) {
                return null;
            }
            return post;
        });
    }
    static createBlog(createBlogModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, websiteUrl, description } = createBlogModel;
            const newBlog = {
                name,
                description,
                websiteUrl,
                createdAt: (new Date()).toISOString(),
                isMembership: false
            };
            const createdBlogId = yield blog_repository_1.BlogRepository.createBlog(newBlog);
            if (!createdBlogId) {
                return null;
            }
            const blog = yield blog_query_repository_1.BlogQueryRepository.getById(createdBlogId);
            if (!blog) {
                return null;
            }
            return blog;
        });
    }
    static updateBlog(blogId, updateBlogModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_query_repository_1.BlogQueryRepository.getById(blogId);
            if (!blog) {
                return null;
            }
            return yield blog_repository_1.BlogRepository.updateBlog(blogId, updateBlogModel);
        });
    }
    static deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_query_repository_1.BlogQueryRepository.getById(blogId);
            if (!blog) {
                return null;
            }
            return yield blog_repository_1.BlogRepository.deleteBlog(blogId);
        });
    }
}
exports.BlogService = BlogService;
