"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blog_validators_1 = require("../validators/blog-validators");
const blog_repository_1 = require("../repositories/blog-repository");
exports.blogRoute = (0, express_1.Router)({});
exports.blogRoute.get('/', (req, res) => {
    const blogs = blog_repository_1.BlogRepository.getAll();
    res.send(blogs).sendStatus(200);
});
exports.blogRoute.get('/:id', (req, res) => {
    const id = +req.params.id;
    const blog = blog_repository_1.BlogRepository.getById(id);
    if (blog) {
        res.send(blog);
    }
    else {
        res.sendStatus(404);
        return;
    }
});
exports.blogRoute.post('/', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => {
    const { name, description, websiteUrl, } = req.body;
    const newBlog = {
        id: +(new Date()),
        name,
        description,
        websiteUrl
    };
    const createdBlog = blog_repository_1.BlogRepository.createBlog(newBlog);
    res.status(201).send(createdBlog);
    return;
});
exports.blogRoute.put('/:id', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => {
    const id = +req.params.id;
    const infoForUpdateBlog = req.body;
    const updatedBlog = blog_repository_1.BlogRepository.updateBlog(id, infoForUpdateBlog);
    if (updatedBlog) {
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
exports.blogRoute.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => {
    const id = +req.params.id;
    const deletedBlog = blog_repository_1.BlogRepository.deleteBlog(id);
    if (deletedBlog) {
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
