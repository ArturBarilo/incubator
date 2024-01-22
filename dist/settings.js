"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
const videos = [{
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2024-01-03T12:22:04.182Z",
        "publicationDate": "2024-01-03T12:22:04.182Z",
        "availableResolutions": [
            "P144"
        ]
    }];
exports.app.get('/videos', (req, res) => {
    res.send(videos);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id == id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
exports.app.post('/videos', (req, res) => {
    const errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || typeof title != 'string' || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' });
    }
    if (!author || typeof author != 'string' || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' });
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            if (!AvailableResolutions.includes(r)) {
                errors.errorsMessages.push({ message: 'Incorrect availableResolutions', field: 'availableResolutions' });
                return;
            }
        });
    }
    else {
        availableResolutions = [];
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.delete('/testing/all-data', (req, res) => {
    videos.length = 0;
    res.sendStatus(204);
});
exports.app.put('/videos/:id', (req, res) => {
    const errors = {
        errorsMessages: []
    };
    const id = +req.params.id;
    let { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    if (!title || typeof title != 'string' || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' });
    }
    if (!author || typeof author != 'string' || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' });
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            if (!AvailableResolutions.includes(r)) {
                errors.errorsMessages.push({ message: 'Incorrect availableResolutions', field: 'availableResolutions' });
                return;
            }
        });
    }
    else {
        availableResolutions = [];
    }
    if (typeof canBeDownloaded != 'boolean') {
        errors.errorsMessages.push({ message: 'Incorrect canBeDownloaded', field: 'canBeDownloaded' });
    }
    if (minAgeRestriction) {
        if (minAgeRestriction > 18 || minAgeRestriction < 1) {
            errors.errorsMessages.push({ message: 'Incorrect minAgeRestriction', field: 'minAgeRestriction' });
        }
    }
    const dateCheking = new Date(publicationDate);
    if (typeof publicationDate != 'string') {
        errors.errorsMessages.push({ message: 'Incorrect publicationDate', field: 'publicationDate' });
    }
    else {
        if (isNaN(dateCheking.getMonth()) || isNaN(dateCheking.getDay()) || isNaN(dateCheking.getFullYear())) {
            errors.errorsMessages.push({ message: 'Incorrect publicationDate', field: 'publicationDate' });
        }
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    let video = videos.find(v => v.id == id);
    if (video) {
        video.canBeDownloaded = req.body.canBeDownloaded;
        video.minAgeRestriction = req.body.minAgeRestriction;
        video.publicationDate = req.body.publicationDate;
        video.title = req.body.title;
        video.author = req.body.author;
        video.availableResolutions = availableResolutions;
    }
    else {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
});
exports.app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const videoIndex = videos.findIndex(v => v.id == id);
    if (videoIndex < 0) {
        res.sendStatus(404);
        return;
    }
    else {
        videos.splice(videoIndex, 1);
    }
    res.sendStatus(204);
    return;
});
