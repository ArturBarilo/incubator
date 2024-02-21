import { Router } from "express";
import { Request, Response } from "express";
import {RequestWithBody} from "../common";
import {LoginInputModel} from "../models/auth/input/login-input-model";
import {AuthService} from "../services/auth-service";
import {loginValidation} from "../validators/auth-validators";

export const authRoute = Router({})



authRoute.post('/login', loginValidation(), async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const { loginOrEmail, password } = req.body

    const checkingUser = await AuthService.login(loginOrEmail, password)

    if(!checkingUser) return res.sendStatus(401)

    return res.send({token: checkingUser})
})