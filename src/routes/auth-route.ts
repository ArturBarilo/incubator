import { Router } from "express";
import { Request, Response } from "express";
import {RequestWithBody} from "../common";
import {LoginInputModel} from "../models/auth/input/login-input-model";
import {AuthService} from "../services/auth-service";
import {codeValidation, loginValidation, resendingEmailRegistrationValidation} from "../validators/auth-validators"
import { JWTService } from "../application/jwt-service";
import { jwtAuthMiddleware } from "../middlewares/auth/jwt-auth-middleware"
import { OutputUserTypeForMe } from "../models/user/output/user-output-model";
import { CreateUserModel } from "../models/user/input/create-user-model";
import { createUserAccountValidation, createUserValidation } from "../validators/user-validators";
import {emailAdapter} from "../adapters/email-adapter";
import {businessService} from "../domain/business-service";
import {UserRepository} from "../repositories/user-repository";


export const authRoute = Router({})


authRoute.post('/registration', createUserAccountValidation(), async (req: RequestWithBody<CreateUserModel>, res: Response) => {
    const createUserModel: CreateUserModel = req.body

    const createUser = await AuthService.createUser(createUserModel)

    if(!createUser) res.sendStatus(400)

    return res.sendStatus(204)
})

authRoute.post('/registration-email-resending', resendingEmailRegistrationValidation(), async (req: Request, res: Response) => {
    const email = req.body.email

    await businessService.resendRegistrationEmail(email)

    return res.sendStatus(204)
})


authRoute.post('/registration-confirmation', codeValidation(), async (req: Request, res: Response) => {
    const result = await AuthService.confirmEmail(req.body.code)

    if (result) return res.sendStatus(204)

    return res.sendStatus(400)
})

authRoute.post('/login', loginValidation(), async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const { loginOrEmail, password } = req.body

    const user = await AuthService.login(loginOrEmail, password)

    if(user) {
        const token = await JWTService.createJWT(user._id.toString())
        
        return res.status(200).send({accessToken: token})
    }

    return res.sendStatus(401)
})

authRoute.get('/me', jwtAuthMiddleware, async (req: Request, res: Response)=> {
    const currentUser = AuthService.getInfoAboutCurrentUser(req.user)
    return res.status(200).send(currentUser)
})

authRoute.delete('/:email', async (req: Request, res: Response) => {
    const email = req.params.email

    const deletedUser = await UserRepository.deleteUserByEmail(email)

    if(deletedUser) return res.sendStatus(204)

    return res.sendStatus(200)
})