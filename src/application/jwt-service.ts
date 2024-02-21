import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from  '../settings'

export class JWTService {

    static async createJWT(userId: string) {
        const token = jwt.sign({id: userId}, JWT_SECRET_KEY, {expiresIn: '1h'})

        return token
    }

}