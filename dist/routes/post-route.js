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
const post_validators_1 = require("../validators/post-validators");
const mongodb_1 = require("mongodb");
const post_query_repository_1 = require("../repositories/post-query-repository");
const post_service_1 = require("../services/post-service");
exports.postRoute = (0, express_1.Router)({});
exports.postRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const sortData = {
        sortBy: (_a = req.query.sortBy) !== null && _a !== void 0 ? _a : 'createdAt',
        sortDirection: (_b = req.query.sortDirection) !== null && _b !== void 0 ? _b : 'desc',
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10
    };
    const posts = yield post_query_repository_1.PostQueryRepository.getAll(sortData);
    res.status(200).send(posts);
}));
exports.postRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const post = yield post_query_repository_1.PostQueryRepository.getById(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    res.status(200).send(post);
}));
exports.postRoute.post('/', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createPostModel = req.body;
    const post = yield post_service_1.PostService.createPost(createPostModel);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    res.status(201).send(post);
}));
exports.postRoute.put('/:id', auth_middleware_1.authMiddleware, (0, post_validators_1.postValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
        return;
    }
    const infoForUpdatePost = req.body;
    const postIsUpdated = yield post_service_1.PostService.updatePost(id, infoForUpdatePost);
    if (!postIsUpdated) {
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
    const deletedPost = yield post_service_1.PostService.deletePost(id);
    if (!deletedPost) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
}));
