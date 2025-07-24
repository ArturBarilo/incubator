import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendRegistrationEmail(email: string, code: string) {
        const message = `<h1>Thank for your registration</h1> 
        <p>To finish registration please follow the link below: 
        <a href='${process.env.ADDRESS}/confirm-email?code=${code}'>complete registration</a></p>`
        await emailAdapter.sendEmail(email, 'registration', message)
    },

    async resendRegistrationEmail(email: string, newCode: string) {
        const message = `<h1>Thank for your registration</h1> 
        <p>To finish registration please follow the link below: 
        <a href='${process.env.ADDRESS}/confirm-email?code=${newCode}'>complete registration</a></p>`
        await emailAdapter.sendEmail(email, 'resend registration email', message)
    }
}