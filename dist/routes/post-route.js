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
exports.postRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blog_repository_1 = require("../repositories/blog-repository");
const post_repository_1 = require("../repositories/post-repository");
const post_validators_1 = require("../validators/post-validators");
const mongodb_1 = require("mongodb");
exports.postRoute = (0, express_1.Router)({});
exports.postRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_repository_1.PostRepository.getAll();
    res.status(200).send(posts);
    return;
}));
exports.postRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const post = yield post_repository_1.PostRepository.getById(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    res.status(200).send(post);
}));
exports.postRoute.post('/', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content, blogId } = req.body;
    const blogName = yield blog_repository_1.BlogRepository.getById(blogId);
    if (blogName) {
        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogName.name,
            createdAt: (new Date()).toISOString()
        };
        const createdPostId = yield post_repository_1.PostRepository.createPost(newPost);
        const post = yield post_repository_1.PostRepository.getById(createdPostId);
        if (!post) {
            res.sendStatus(404);
            return;
        }
        res.status(201).send(post);
        return;
    }
    res.sendStatus(404);
    return;
}));
exports.postRoute.put('/:id', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const post = yield post_repository_1.PostRepository.getById(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    const infoForUpdatePost = req.body;
    const updatedPost = yield post_repository_1.PostRepository.updatePost(id, infoForUpdatePost);
    if (!updatedPost) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
}));
exports.postRoute.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const existingPost = yield post_repository_1.PostRepository.getById(id);
    if (!existingPost) {
        res.sendStatus(404);
        return;
    }
    const post = yield post_repository_1.PostRepository.deletePost(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
}));
