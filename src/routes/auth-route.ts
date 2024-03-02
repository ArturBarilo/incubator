import { Router } from "express";
import { Request, Response } from "express";
import {RequestWithBody} from "../common";
import {LoginInputModel} from "../models/auth/input/login-input-model";
import {AuthService} from "../services/auth-service";
import {loginValidation} from "../validators/auth-validators"
import { JWTService } from "../application/jwt-service";
import { jwtAuthMiddleware } from "../middlewares/auth/jwt-auth-middleware"
import { OutputUserTypeForMe } from "../models/user/output/user-output-model";

export const authRoute = Router({})



authRoute.post('/login', loginValidation(), async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const { loginOrEmail, password } = req.body

    const user = await AuthService.login(loginOrEmail, password)

    if(user) {
        const token = await JWTService.createJWT(user._id.toString())
        
        return res.status(200).send({accessToken: token})
    }

    return res.sendStatus(401)
})

authRoute.get('/me',jwtAuthMiddleware, async (req: Request, res: Response)=> {
    const currentUser = AuthService.getInfoAboutCerrentUser(req.user)

    return res.status(200).send(currentUser)
})