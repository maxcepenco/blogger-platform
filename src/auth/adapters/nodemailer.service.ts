import {SETTINGS} from "../../core/settings/settings";
import nodemailer from 'nodemailer';


export const nodemailerService = {
    async sendEmail(email: string, code: string, template:(code:string)=> string):Promise<boolean> {

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from: '"Kek" <codeSender>',
            to: email,
            subject: 'Your code is here',
            html: template(code),
        })

        return !!info;
    }

}