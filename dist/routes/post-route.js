"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blog_repository_1 = require("../repositories/blog-repository");
const post_repository_1 = require("../repositories/post-repository");
const post_validators_1 = require("../validators/post-validators");
exports.postRoute = (0, express_1.Router)({});
exports.postRoute.get('/', (req, res) => {
    const posts = post_repository_1.PostRepository.getAll();
    res.status(200).send(posts);
    return;
});
exports.postRoute.get('/:id', (req, res) => {
    const id = req.params.id;
    const post = post_repository_1.PostRepository.getById(id);
    if (post) {
        res.send(post);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
exports.postRoute.post('/', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => {
    const { title, shortDescription, content, blogId } = req.body;
    const blogName = blog_repository_1.BlogRepository.getById(blogId);
    if (blogName) {
        const newPost = {
            id: (new Date()).toISOString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogName.name
        };
        const createdPost = post_repository_1.PostRepository.createPost(newPost);
        res.status(201).send(createdPost);
        return;
    }
});
exports.postRoute.put('/:id', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => {
    const id = req.params.id;
    const infoForUpdatePost = req.body;
    const updatedPost = post_repository_1.PostRepository.updatePost(id, infoForUpdatePost);
    if (updatedPost) {
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
exports.postRoute.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => {
    const id = req.params.id;
    const deletedPost = post_repository_1.PostRepository.deletePost(id);
    if (deletedPost) {
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
