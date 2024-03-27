import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/inputValidation/input-validation-middleware";
import { UserRepository } from "../repositories/user-repository";

const loginValidator = body('login').isString().withMessage('Login must be a string').trim()
.isLength({min: 3, max: 10}).matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect login').custom(async (value) => {
    const checkingLogin = await UserRepository.checkingUniqueLogin(value)
        
    if(!checkingLogin) throw Error('login already exist')

    return true
})

const passwordValidator = body('password').isString().withMessage('Password must be a string')
.trim().isLength({min: 6, max: 20}).withMessage('Incorrect password')

const emailValidator = body('email').isString().withMessage('Email must be a string')
.trim().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Incorrect email').custom(async (value) => {
    const checkingEmail = await UserRepository.checkingUniqueEmail(value)
        
    if(!checkingEmail) throw Error('login already exist')

    return true
})

export const createUserValidation = () => [loginValidator, passwordValidator, emailValidator, inputValidationMiddleware]
export const createUserAccountValidation = () => [loginValidator, passwordValidator, emailValidator, inputValidationMiddleware]