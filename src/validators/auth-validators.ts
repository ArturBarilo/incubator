import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/inputValidation/input-validation-middleware";

const loginOrEmailValidator = body('loginOrEmail').isString().withMessage('must be a string')

const passwordValidator = body('password').isString().withMessage('Password must be a string')

export const loginValidation = () => [loginOrEmailValidator, passwordValidator, inputValidationMiddleware]