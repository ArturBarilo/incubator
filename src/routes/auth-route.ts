import { Router } from "express";
import { Request, Response } from "express";
import {RequestWithBody} from "../common";
import {LoginInputModel} from "../models/auth/input/login-input-model";
import {AuthService} from "../services/auth-service";
import {loginValidation} from "../validators/auth-validators"
import { JWTService } from "../application/jwt-service";
import { jwtAuthMiddleware } from "../middlewares/auth/jwt-auth-middleware"
import { OutputUserTypeForMe } from "../models/user/output/user-output-model";
import { CreateUserModel } from "../models/user/input/create-user-model";
import { createUserAccountValidation, createUserValidation } from "../validators/user-validators";


export const authRoute = Router({})


authRoute.post('/registration', createUserAccountValidation(), async (req: RequestWithBody<CreateUserModel>, res: Response) => {
    const createUserModel: CreateUserModel = req.body

    const createUser = await AuthService.createUser(createUserModel)



    //to businessservice
    // const transporter = nodemailer.createTransport({
    //     service: "mail.ru",
    //     secure: false,
    //     auth: {
    //       user: "sender_app_tg@mail.ru",
    //       pass: "46xR9jp1KKVhacDYha3Q",
    //     },
    // });

    // const info = await transporter.sendMail({
    //     from: 'Artur <sender_app_tg@mail.ru>', // sender address
    //     to: "sanitarfresh@gmail.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     // text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    //   });

    // console.log(info)
    // res.sendStatus(200)
    // return
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
    const currentUser = AuthService.getInfoAboutCerrentUser(req.user)

    return res.status(200).send(currentUser)
})