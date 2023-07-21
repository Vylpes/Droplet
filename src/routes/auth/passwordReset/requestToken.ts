import { hash } from "bcryptjs";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { UserTokenType } from "../../../constants/UserTokenType";
import { Page } from "../../../contracts/Page";
import { User } from "../../../entity/User";
import UserToken from "../../../entity/UserToken";
import EmailHelper from "../../../helpers/EmailHelper";
import PasswordHelper from "../../../helpers/PasswordHelper";
import Body from "../../../helpers/Validation/Body";
import MessageHelper from "../../../helpers/MessageHelper";

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

            const user = await User.FetchOneByEmail(email, [
                "Tokens"
            ]);

            if (!user) {
                const message = new MessageHelper(req);
                await message.Info('If this email is correct you should receive an email to reset your password.');

                res.redirect('/auth/login');
                return;
            }

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

            resetLink = resetLink.replace('{token}', token);

            const userToken = new UserToken(hashedToken, tokenExpiryDate, UserTokenType.PasswordReset);

            await userToken.Save(UserToken, userToken);

            user.AddTokenToUser(userToken);

            await user.Save(User, user);

            await EmailHelper.SendEmail(user.Email, "PasswordReset", [{
                key: "username",
                value: user.Username,
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
