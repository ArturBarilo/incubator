import { WithId } from "mongodb";
import { UserAccountDb, UserDb } from "../db/user-db";
import { OutputUserType } from "../output/user-output-model";

export const userMapper = (user: WithId<UserAccountDb>): OutputUserType => {
    return {
        id: user._id.toString(),
        login: user.accountData.userName,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}