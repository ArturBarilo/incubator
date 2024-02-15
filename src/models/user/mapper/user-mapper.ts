import { WithId } from "mongodb";
import { UserDb } from "../db/user-db";
import { OutputUserType } from "../output/user-output-model";

export const userMapper = (user: WithId<UserDb>): OutputUserType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}