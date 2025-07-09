import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        const transporter = nodemailer.createTransport({
            service: "mail.ru",
            secure: false,
            auth: {
                user: process.env.SENDING_EMAIL,
                pass: process.env.PASSWORD_SENDING_EMAIL,
            },
        });
    
        const info = await transporter.sendMail({
            from: 'Artur <sender_app_tg@mail.ru>',
            // to: email,
            to: "sanitarfresh@gmail.com",
            subject: subject,
            html: message,
            // html: "<b>Hello world?</b>",
          });

        return info;
    }
}