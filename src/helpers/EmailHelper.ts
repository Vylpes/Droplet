import { readFileSync } from "fs";
import nodemailer from "nodemailer";

export default class EmailHelper {
    public static async SendEmail(to: string, template: string, variables: IEmailVariable[]) {
        const transporter = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            secure: false,
        });

        const subject = readFileSync(`${process.cwd()}/emails/${template}/subject.txt`).toString();
        const text = readFileSync(`${process.cwd()}/emails/${template}/text.txt`).toString();
        const html = readFileSync(`${process.cwd()}/emails/${template}/html.html`).toString();

        const formattedText = this.FormatDocument(text, variables);
        const formattedHtml = this.FormatDocument(html, variables);

        await transporter.sendMail({
            from: '"Droplet" <apps@vylpes.com>',
            to: to,
            subject: subject,
            text: formattedText,
            html: formattedHtml,
        });
    }

    private static FormatDocument(doc: string, variables: IEmailVariable[]): string {
        let out = doc;

        for (let variable of variables) {
            out = out.replace(`{${variable.key}}`, variable.value);
        }

        return out;
    }
}

export interface IEmailVariable {
    key: string;
    value: string;
}