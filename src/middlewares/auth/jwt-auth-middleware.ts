import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../application/jwt-service";
import { UserService } from "../../services/user-service";


export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.headers.authorization) return res.sendStatus(401)

    const token = req.headers.authorization.split(' ')[1]

    const userId: string = await JWTService.getUserIdByToken(token)
   
    if(userId) {
        req.user = await UserService.getUserById(userId)
        
        next()
        return
    }
    
    res.sendStatus(401)
    return
}