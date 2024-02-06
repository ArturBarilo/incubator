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
exports.PostService = void 0;
const blog_query_repository_1 = require("../repositories/blog-query-repository");
const post_query_repository_1 = require("../repositories/post-query-repository");
const post_repository_1 = require("../repositories/post-repository");
class PostService {
    static createPost(createPostModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = createPostModel;
            const blog = yield blog_query_repository_1.BlogQueryRepository.getById(createPostModel.blogId);
            if (!blog) {
                return null;
            }
            const newPost = {
                title,
                shortDescription,
                content,
                blogId,
                blogName: blog.name,
                createdAt: (new Date()).toISOString()
            };
            const createdPostId = yield post_repository_1.PostRepository.createPost(newPost);
            const post = yield post_query_repository_1.PostQueryRepository.getById(createdPostId);
            if (!post) {
                return null;
            }
            return post;
        });
    }
    static updatePost(postId, updatePostModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_query_repository_1.PostQueryRepository.getById(postId);
            if (!post) {
                return null;
            }
            return post_repository_1.PostRepository.updatePost(postId, updatePostModel);
        });
    }
    static deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = post_query_repository_1.PostQueryRepository.getById(postId);
            if (!post) {
                return null;
            }
            return post_repository_1.PostRepository.deletePost(postId);
        });
    }
}
exports.PostService = PostService;
