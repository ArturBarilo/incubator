import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from '../settings'
import { ObjectId } from "mongodb";

export class JWTService {
    static async createJWT(userId: string) {
        const token = jwt.sign({ id: userId }, JWT_SECRET_KEY, { expiresIn: '1h' })

        return token
    }

    static async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET_KEY)
            
            return result.id
        } catch(err) {
            return null
        }
        
    }

}