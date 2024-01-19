"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const formatedError = (0, express_validator_1.validationResult)(req).formatWith((error) => ({
        message: error.msg,
        field: error.type == 'field' ? error.path : 'unknown'
    }));
    if (!formatedError.isEmpty()) {
        const errorMessages = formatedError.array({ onlyFirstError: true });
        res.status(400).send({ errorsMessages: errorMessages });
        return;
    }
    return next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
