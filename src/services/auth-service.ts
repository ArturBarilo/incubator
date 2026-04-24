import {UserAccountDb, UserDbWithId} from "../models/user/db/user-db";
import {CreateUserModel} from "../models/user/input/create-user-model";
import {OutputUserTypeForMe} from "../models/user/output/user-output-model";
import {UserQueryRepository} from "../repositories/user-query-repository";
import {UserRepository} from "../repositories/user-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";
import {businessService} from "../domain/business-service";


export class AuthService {
    static async createUser(createUserModel: CreateUserModel) {
        const { login, email, password } = createUserModel

        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserAccountDb = {
            accountData: {
                userName: login,
                email,
                password: passwordHash,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation: {
                isConfirmed: false,
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 1, minutes: 3}),
            }
        }

        const createdUserId = await UserRepository.createUser(newUser)

        const user = await UserQueryRepository.getUserById(createdUserId)

        if (!user) return false

        await businessService.sendRegistrationEmail(email)

        // return true
        return newUser
    }

    static async confirmEmail(code: string) {
        const user = await UserQueryRepository.getUserByCode(code)

        if (!user) return false

        return await UserRepository.updateConfirmation(user._id)
    }

    static async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)

        return hash
    }

    static async login(loginOrEmail: string, password: string) {
        const user = await UserRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return false

        // if (!user.emailConfirmation.isConfirmed) return false

        const checkingPassword = await bcrypt.compare(password, user.accountData.password)

        if (!checkingPassword) return false

        return user
    }

    static getInfoAboutCurrentUser(userFromReq: UserDbWithId) {
        const currentUser: OutputUserTypeForMe = {
            email: userFromReq.email,
            login: userFromReq.login,
            userId: userFromReq._id.toString()
        }

        return currentUser
    }

    static async updateCode(email: string) {
        const newCode = uuidv4()
        await UserRepository.updateCodeForResendingEmail(email, newCode)

        return newCode
    }
}
