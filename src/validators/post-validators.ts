import { body } from "express-validator";
import { BlogRepository } from "../repositories/blog-repository";
import { inputValidationMiddleware } from "../middlewares/inputValidation/input-validation-middleware";

const titleValidator = body('title').isString().withMessage('title must be a string')
    .trim().isLength({ min: 1, max: 30 }).withMessage('Incorrect title')

const shortDescriptionValidator = body('shortDescription').isString().withMessage('shortDescription must be a string')
    .trim().isLength({ min: 1, max: 100 }).withMessage('Incorrect shortDescription')

const contentValidator = body('content').isString().withMessage('content must be a string')
    .trim().isLength({ min: 1, max: 1000 }).withMessage('Incorrect content')

const blogIdValidator = body('blogId').custom(async (value) => {

    const blog = await BlogRepository.getById(value)

    if (!blog) {
        throw Error('Incorrect blogId')
        // or return false
    }
    return true

})
    .withMessage('Incorrect blogId')

export const postValidation = () => [titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator, inputValidationMiddleware]