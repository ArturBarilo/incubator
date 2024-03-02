import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/inputValidation/input-validation-middleware";

const contentValidator = body('content').isString().trim().isLength({min: 20, max: 300}).withMessage('comment length should be 20 to 300 symbols')

export const commentValidation = () => [contentValidator, inputValidationMiddleware]