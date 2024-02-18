import { hash } from "bcryptjs";
import { Request, Response } from "express";
import { UserTokenType } from "../../../constants/UserTokenType";
import Page from "../../../contracts/Page";
import { User } from "../../../database/entities/User";
import UserToken from "../../../database/entities/UserToken";
import EmailHelper from "../../../helpers/EmailHelper";
import PasswordHelper from "../../../helpers/PasswordHelper";
import BodyValidator from "../../../helpers/Validation/BodyValidator";
import MessageHelper from "../../../helpers/MessageHelper";

export default class Create implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("username")
                .NotEmpty()
            .ChangeField("email")
                .NotEmpty()
                .EmailAddress()
            .ChangeField("admin")
                .NotEmpty()
                .Boolean();

        if (!await bodyValidation.Validate(req)) {
            res.redirect('/settings/users');
            return;
        }

        const username = req.body.username;
        const email = req.body.email;
        const admin = req.body.admin;

        const userByUsername = await User.FetchOneByUsername(username);
        const userByEmail = await User.FetchOneByEmail(email);

        if (userByUsername || userByEmail) {
            const message = new MessageHelper(req);
            await message.Error('Username and Email must be unique');

            res.redirect('/settings/users');
            return;
        }

        let user = new User(email, username, await PasswordHelper.GenerateRandomHashedPassword(), false, admin == "true", true);

        await user.Save(User, user);

        user = await User.FetchOneById(User, user.Id, [
            "Tokens"
        ]);

        const now = new Date();

        const tokenExpiryDate = new Date(now.getTime() + (1000 * 60 * 60 * 24 * 2)) // 2 days

        const token = await PasswordHelper.GenerateRandomToken();
        const hashedToken = await hash(token, 10);

        let verifyLink = process.env.EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK;

        if (!verifyLink) {
            const message = new MessageHelper(req);
            await message.Error('Invalid config: EMAIL_TEMPLATE_VERIFYUSER_VERIFYLINK');

            res.redirect('/settings/users');
            return;
        }

        verifyLink = verifyLink.replace('{token}', token);

        const userToken = new UserToken(hashedToken, tokenExpiryDate, UserTokenType.Verification);

        await userToken.Save(UserToken, userToken);

        user.AddTokenToUser(userToken);

        await user.Save(User, user);

        await EmailHelper.SendEmail(user.Email, "VerifyUser", [{
            key: "username",
            value: user.Username,
        }, {
            key: "verify_link",
            value: verifyLink,
        }]);

        const message = new MessageHelper(req);
        await message.Info('Successfully created user');

        res.redirect('/settings/users');
    }
}