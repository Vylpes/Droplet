import { hash } from "bcryptjs";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { UserTokenType } from "../../../constants/UserTokenType";
import { Page } from "../../../contracts/Page";
import EmailHelper from "../../../helpers/EmailHelper";
import PasswordHelper from "../../../helpers/PasswordHelper";
import Body from "../../../helpers/Validation/Body";
import MessageHelper from "../../../helpers/MessageHelper";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import User from "../../../contracts/entities/User/User";
import UserToken from "../../../contracts/entities/User/IUserToken";
import { v4 } from "uuid";

export default class RequestToken extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/password-reset/request', async (req: Request, res: Response, next: NextFunction) => {
            if (req.session.User) {
                next(createHttpError(403));
                return;
            }

            res.render('auth/password-reset/request-token');
        });
    }

    public OnPost(): void {
        const bodyValidation = new Body("email", "/auth/login")
                .NotEmpty()
                .EmailAddress();

        super.router.post('/password-reset/request', bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const email = req.body.email;

            const userMaybe = await ConnectionHelper.FindOne<User>("user", { email: email })

            if (!userMaybe.IsSuccess) {
                const message = new MessageHelper(req);
                await message.Info('If this email is correct you should receive an email to reset your password.');

                res.redirect('/auth/login');
                return;
            }

            const user = userMaybe.Value;

            const now = new Date();

            const tokenExpiryDate = new Date(now.getTime() + (1000 * 60 * 60 * 24 * 2)) // 2 days

            const token = await PasswordHelper.GenerateRandomToken();
            const hashedToken = await hash(token, 10);

            let resetLink = process.env.EMAIL_TEMPLATE_PASSWORDRESET_RESETLINK;

            if (!resetLink) {
                const message = new MessageHelper(req);
                await message.Error('Invalid config: EMAIL_TEMPLATE_PASSWORDRESET_RESETLINK');

                res.redirect('/auth/login');
                return;
            }

            resetLink = resetLink
                .replace('{token}', token)
                .replace('{username}', user.username);

            const userToken: UserToken = {
                uuid: v4(),
                token: hashedToken,
                expires: tokenExpiryDate,
                type: UserTokenType.PasswordReset,
            }

            user.tokens.push(userToken);

            await ConnectionHelper.UpdateOne<User>("user", { uuid: user.uuid }, { "$set": user });

            await EmailHelper.SendEmail(user.email, "PasswordReset", [{
                key: "username",
                value: user.username,
            }, {
                key: "reset_link",
                value: resetLink,
            }]);

            const message = new MessageHelper(req);
            await message.Info('If this email is correct you should receive an email to reset your password.');

            res.redirect('/auth/login');
        });
    }
}
