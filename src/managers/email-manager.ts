//sendRegistrationMessage() {
//emailAdapter.sendEmail()
//}

import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendRegistrationEmail(email: string, code: string) {
        // const message = `${code}`
        const message = `<h1>Thank for your registration</h1> 
        <p>To finish registration please follow the link below: 
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a></p>`
        await emailAdapter.sendEmail(email, 'registration', message)
    },

    async resendRegistrationEmail(email: string, code: string) {
        const message = `<h1>Thank for your registration</h1> 
        <p>To finish registration please follow the link below: 
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a></p>`
        await emailAdapter.sendEmail(email, 'resend registration email', message)
    }
}