import EmailHelper from '../../src/helpers/EmailHelper';
import nodemailer from "nodemailer";
import fs from 'fs';

jest.mock('fs');

beforeEach(() => {
    process.env = {};
});

describe("SendEmail", () => {
    test("GIVEN EMAIL_AUTH_ENABLE is false, EXPECT transporter to be created without auth", async () => {
        // Arrange
        process.env.EMAIL_AUTH_ENABLE = "false";
        process.env.EMAIL_FROM_NAME = "Test";
        process.env.EMAIL_FROM_ADDRESS = "test@mail.com";
        process.env.EMAIL_HOST = "smtp.mail.com";
        process.env.EMAIL_PORT = "587";
        process.env.EMAIL_SECURE = "false";
        process.env.EMAIL_TLS_REJECT_UNAUTHORISED = "false";
        const to = "test@example.com";
        const template = "welcome";
        const variables = [
            { key: "name", value: "John Doe" },
            { key: "email", value: "john@example.com" }
        ];
        const sendMail = jest.fn().mockResolvedValue(true);
        nodemailer.createTransport = jest.fn().mockImplementation(() => {
            return {
                sendMail: sendMail,
            } as unknown as nodemailer.Transporter;
        });

        fs.readFileSync = jest.fn()
            .mockReturnValueOnce(Buffer.from("Subject"))
            .mockReturnValueOnce(Buffer.from("Text, {name} {email}"))
            .mockReturnValueOnce(Buffer.from("Html, {name} {email}"));
        process.cwd = jest.fn().mockReturnValue("/project");

        // Act
        await EmailHelper.SendEmail(to, template, variables);

        // Assert
        expect(sendMail).toBeCalledWith({
            from: `"Test" <test@mail.com>`,
            to: "test@example.com",
            subject: "Subject",
            text: "Text, John Doe john@example.com",
            html: "Html, John Doe john@example.com",
        });

        expect(nodemailer.createTransport).toBeCalledWith({
            host: "smtp.mail.com",
            port: 587,
            secure: false,
            tls: {
                rejectUnauthorized: false
            },
        });

        expect(fs.readFileSync).toBeCalledWith("/project/emails/welcome/subject.txt");
        expect(fs.readFileSync).toBeCalledWith("/project/emails/welcome/text.txt");
        expect(fs.readFileSync).toBeCalledWith("/project/emails/welcome/html.html");
    });

    test("GIVEN EMAIL_AUTH_ENABLE is true, EXPECT transporter to be created with auth", async () => {
        // Arrange
        process.env.EMAIL_AUTH_ENABLE = "true";
        process.env.EMAIL_FROM_NAME = "Test";
        process.env.EMAIL_FROM_ADDRESS = "test@mail.com";
        process.env.EMAIL_HOST = "smtp.mail.com";
        process.env.EMAIL_PORT = "587";
        process.env.EMAIL_SECURE = "false";
        process.env.EMAIL_TLS_REJECT_UNAUTHORISED = "false";
        process.env.EMAIL_AUTH_USER = "user";
        process.env.EMAIL_AUTH_PASS = "pass";
        const to = "test@example.com";
        const template = "welcome";
        const variables = [
            { key: "name", value: "John Doe" },
            { key: "email", value: "john@example.com" }
        ];
        const sendMail = jest.fn().mockResolvedValue(true);
        nodemailer.createTransport = jest.fn().mockImplementation(() => {
            return {
                sendMail: sendMail,
            } as unknown as nodemailer.Transporter;
        });

        fs.readFileSync = jest.fn()
            .mockReturnValueOnce(Buffer.from("Subject"))
            .mockReturnValueOnce(Buffer.from("Text, {name} {email}"))
            .mockReturnValueOnce(Buffer.from("Html, {name} {email}"));
        process.cwd = jest.fn().mockReturnValue("/project");

        // Act
        await EmailHelper.SendEmail(to, template, variables);

        // Assert
        expect(sendMail).toBeCalledWith({
            from: `"Test" <test@mail.com>`,
            to: "test@example.com",
            subject: "Subject",
            text: "Text, John Doe john@example.com",
            html: "Html, John Doe john@example.com",
        });

        expect(nodemailer.createTransport).toBeCalledWith({
            host: "smtp.mail.com",
            port: 587,
            secure: false,
            auth: {
                user: "user",
                pass: "pass",
            },
            tls: {
                rejectUnauthorized: false
            },
        });

        expect(fs.readFileSync).toBeCalledWith("/project/emails/welcome/subject.txt");
        expect(fs.readFileSync).toBeCalledWith("/project/emails/welcome/text.txt");
        expect(fs.readFileSync).toBeCalledWith("/project/emails/welcome/html.html");
    });
});