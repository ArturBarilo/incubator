//save to repo

//...........
// обращение к менеджеру
//emailManager.sendRegistrationMessage(userfromrepo)

import {emailAdapter} from "../adapters/email-adapter";
import {emailManager} from "../managers/email-manager";
import {UserQueryRepository} from "../repositories/user-query-repository";

export const businessService = {
    async sendRegistrationEmail(email: string) {
        const user = await UserQueryRepository.getUserByEmail(email)
        if (!user) return null

        const code = user.emailConfirmation.confirmationCode
        console.log('User',user)
        console.log('Code', code)


        return emailManager.sendRegistrationEmail(email, code)
    },

    async resendRegistrationEmail(email: string) {
        const user = await UserQueryRepository.getUserByEmail(email)
        if (!user) return null

        const code = user.emailConfirmation.confirmationCode

        return emailManager.resendRegistrationEmail(email, code)
    }
}