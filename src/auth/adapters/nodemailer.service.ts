import {SETTINGS} from "../../core/settings/settings";
import nodemailer from 'nodemailer';


export const nodemailerService = {
    async sendEmail(email: string, code: string, template:(code:string)=> string):Promise<boolean> {

        let transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true, // использовать SSL
            auth:{
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from: `"Kek" <${SETTINGS.EMAIL}>`,
            to: email,
            subject: 'Your code is here',
            html: template(code),
        })

        return !!info;
    }

}