import { readFileSync } from "fs";
import nodemailer from "nodemailer";

export default class EmailHelper {
    public static async SendEmail(to: string, template: string, variables: IEmailVariable[]) {
        let transporter: nodemailer.Transporter;

        if (process.env.EMAIL_AUTH_ENABLE == "true") {
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST, 
                port: Number(process.env.EMAIL_PORT),
                secure: process.env.EMAIL_SECURE == "true",
                auth: {
                    user: process.env.EMAIL_AUTH_USER,
                    pass: process.env.EMAIL_AUTH_PASS,
                },
                tls: {
                    rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORISED == "true"
                }
            });
        } else {
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST, 
                port: Number(process.env.EMAIL_PORT),
                secure: process.env.EMAIL_SECURE == "true",
                tls: {
                    rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORISED == "true"
                }
            });
        }

        const subject = readFileSync(`${process.cwd()}/emails/${template}/subject.txt`).toString();
        const text = readFileSync(`${process.cwd()}/emails/${template}/text.txt`).toString();
        const html = readFileSync(`${process.cwd()}/emails/${template}/html.html`).toString();

        const formattedText = this.FormatDocument(text, variables);
        const formattedHtml = this.FormatDocument(html, variables);

        await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: to,
            subject: subject,
            text: formattedText,
            html: formattedHtml,
        });
    }

    private static FormatDocument(doc: string, variables: IEmailVariable[]): string {
        let out = doc;

        for (let variable of variables) {
            const regex = new RegExp(`{${variable.key}}`, 'g');
            out = out.replace(regex, variable.value);
        }

        return out;
    }
}

export interface IEmailVariable {
    key: string;
    value: string;
}
