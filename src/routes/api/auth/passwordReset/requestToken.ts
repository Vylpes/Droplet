import { hash } from "bcryptjs";
import { Request, Response } from "express";
import { UserTokenType } from "../../../../constants/UserTokenType";
import Page from "../../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../../contracts/IBasicResponse";
import { User } from "../../../../database/entities/User";
import UserToken from "../../../../database/entities/UserToken";
import EmailHelper from "../../../../helpers/EmailHelper";
import PasswordHelper from "../../../../helpers/PasswordHelper";
import ApiBodyValidator from "../../../../helpers/Validation/ApiBodyValidator";

const GENERIC_SUCCESS = "If this email is correct you should receive an email to reset your password.";

export default class RequestToken implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        if (req.session.User) {
            res.status(403).json(GenerateResponse(false, "Already authenticated"));
            return;
        }

        const bodyValidation = new ApiBodyValidator("email")
            .NotEmpty()
            .EmailAddress();

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const email = req.body.email;
        const user = await User.FetchOneByEmail(email, {
            Tokens: true
        });

        if (!user) {
            res.json(GenerateResponse(true, GENERIC_SUCCESS));
            return;
        }

        const now = new Date();
        const tokenExpiryDate = new Date(now.getTime() + (1000 * 60 * 60 * 24 * 2)); // 2 days

        const token = await PasswordHelper.GenerateRandomToken();
        const hashedToken = await hash(token, 10);

        let resetLink = process.env.EMAIL_TEMPLATE_PASSWORDRESET_RESETLINK;

        if (!resetLink) {
            res.status(500).json(GenerateResponse(false, "Invalid config: EMAIL_TEMPLATE_PASSWORDRESET_RESETLINK"));
            return;
        }

        resetLink = resetLink.replace("{token}", token);

        const userToken = new UserToken(hashedToken, tokenExpiryDate, UserTokenType.PasswordReset);

        await userToken.Save(UserToken, userToken);

        user.AddTokenToUser(userToken);

        await user.Save(User, user);

        await EmailHelper.SendEmail(user.Email, "PasswordReset", [{
            key: "username",
            value: user.Username
        }, {
            key: "reset_link",
            value: resetLink
        }]);

        res.json(GenerateResponse(true, GENERIC_SUCCESS));
    }
}
