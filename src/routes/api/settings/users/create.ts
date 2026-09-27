import { hash } from "bcryptjs";
import { Request, Response } from "express";
import { UserTokenType } from "../../../../constants/UserTokenType";
import Page from "../../../../contracts/Page";
import { GenerateResponse } from "../../../../contracts/IBasicResponse";
import { User } from "../../../../database/entities/User";
import UserToken from "../../../../database/entities/UserToken";
import EmailHelper from "../../../../helpers/EmailHelper";
import PasswordHelper from "../../../../helpers/PasswordHelper";
import ApiBodyValidator from "../../../../helpers/Validation/ApiBodyValidator";
import { mapUser } from "../../../../dto";

export default class Create implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("username")
                .NotEmpty()
            .ChangeField("email")
                .NotEmpty()
                .EmailAddress()
            .ChangeField("admin")
                .NotEmpty()
                .Boolean();

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const username = req.body.username;
        const email = req.body.email;
        const admin = req.body.admin;

        const userByUsername = await User.FetchOneByUsername(username);
        const userByEmail = await User.FetchOneByEmail(email);

        if (userByUsername || userByEmail) {
            res.status(400).json(GenerateResponse(false, "Username and Email must be unique"));
            return;
        }

        let user = new User(email, username, await PasswordHelper.GenerateRandomHashedPassword(), false, admin == "true", true);

        await user.Save(User, user);

        user = await User.FetchOneById(User, user.Id, {
            Tokens: true
        });

        const now = new Date();

        const tokenExpiryDate = new Date(now.getTime() + (1000 * 60 * 60 * 24 * 2)) // 2 days

        const token = await PasswordHelper.GenerateRandomToken();
        const hashedToken = await hash(token, 10);

        let verifyLink = process.env.EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK;

        if (!verifyLink) {
            res.status(400).json(GenerateResponse(false, "Invalid config: EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK"));
            return;
        }

        verifyLink = verifyLink.replace('{token}', token);

        const userToken = new UserToken(hashedToken, tokenExpiryDate, UserTokenType.Verification);

        await userToken.Save(UserToken, userToken);

        user.AddTokenToUser(userToken);

        await user.Save(User, user);

        await EmailHelper.SendEmail(user.Email, "VerifyUser", [{
            key: "username",
            value: user.Username
        }, {
            key: "verify_link",
            value: verifyLink
        }]);

        res.json(GenerateResponse(true, "Successfully created user", mapUser(user)));
    }
}
