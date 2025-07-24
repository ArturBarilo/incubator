import {emailManager} from "../managers/email-manager";
import {UserQueryRepository} from "../repositories/user-query-repository";
import {AuthService} from "../services/auth-service";

export const businessService = {
    async sendRegistrationEmail(email: string) {
        const user = await UserQueryRepository.getUserByEmail(email)
        if (!user) return null

        const code = user.emailConfirmation.confirmationCode

        return emailManager.sendRegistrationEmail(email, code)
    },

    async resendRegistrationEmail(email: string) {
        const user = await UserQueryRepository.getUserByEmail(email)

        if (!user || user.emailConfirmation.isConfirmed) return null

        const newCode = await AuthService.updateCode(email)

        return emailManager.resendRegistrationEmail(email, newCode)
    }
}