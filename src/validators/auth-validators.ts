import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/inputValidation/input-validation-middleware";
import {UserQueryRepository} from "../repositories/user-query-repository";

const loginOrEmailValidator = body('loginOrEmail').isString().withMessage('must be a string')

const passwordValidator = body('password').isString().withMessage('Password must be a string')

const emailConfirmationValidator = body('email').isString().withMessage('Email must be a string')
    .trim().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Incorrect email').custom(async (value) => {
        console.log('value', value)
        const user = await UserQueryRepository.getUserByEmail(value)
        if(!user) throw Error('user with this email does not exists')
        if(user.emailConfirmation.isConfirmed === true) throw Error('user already confirmed')
        return true
    })
export const loginValidation = () => [loginOrEmailValidator, passwordValidator, inputValidationMiddleware]

export const resendingEmailRegistrationValidation = () => [emailConfirmationValidator, inputValidationMiddleware]