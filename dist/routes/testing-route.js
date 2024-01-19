"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testing = void 0;
const express_1 = require("express");
const testing_repository_1 = require("../repositories/testing-repository");
exports.testing = (0, express_1.Router)({});
exports.testing.delete('/', (req, res) => {
    testing_repository_1.TestingRepository.deleteAll();
    res.sendStatus(204);
    return;
});
