import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail() {
        //непосредственная отправка письма
        const transporter = nodemailer.createTransport({
            service: "mail.ru",
            secure: false,
            auth: {
              user: "sender_app_tg@mail.ru",
              pass: "46xR9jp1KKVhacDYha3Q",
            },
        });
    
        const info = await transporter.sendMail({
            from: 'Artur <sender_app_tg@mail.ru>',
            to: "sanitarfresh@gmail.com",
            subject: "Hello ✔",
            html: "<b>Hello world?</b>",
          });
    }
}