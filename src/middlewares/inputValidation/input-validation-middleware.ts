import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const formatedError = validationResult(req).formatWith((error: ValidationError) => ({
        message: error.msg,
        field: error.type == 'field' ? error.path : 'unknown'
    }))

    if (!formatedError.isEmpty()) {
        const errorMessages = formatedError.array({ onlyFirstError: true })

        res.status(400).send({ errorsMessages: errorMessages })
        return
    }

    return next()
}