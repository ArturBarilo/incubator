import { UserDbWithId } from "..models/user/db/user-db"

declare global {
    declare namespace Express {
        export interface Request {
            user: UserDbWithId | null
        }
    }
}