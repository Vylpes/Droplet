import EmailHelper from "../../helpers/EmailHelper";

export default async function EmailUserVerificationTokenIntegrationEvent(email: string, username: string, token: string) {
    const verifyLink = process.env.EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK
        .replace("{token}", token);
    
    await EmailHelper.SendEmail(email, "VerifyUser", [{
        key: "username",
        value: username,
    }, {
        key: "verify_link",
        value: verifyLink,
    }]);
}