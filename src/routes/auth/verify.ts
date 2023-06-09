import { compareSync, hash } from "bcryptjs";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { UserTokenType } from "../../constants/UserTokenType";
import { Page } from "../../contracts/Page";
import { User } from "../../entity/User";
import UserToken from "../../entity/UserToken";
import BodyValidation from "../../helpers/Validation/Body";
import QueryValidation from "../../helpers/Validation/Query";
import MessageHelper from "../../helpers/MessageHelper";

export default class Verify extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        const queryValidation = new QueryValidation("token", "/")
                .NotEmpty();

        super.router.get('/verify', queryValidation.Validate.bind(queryValidation), async (req: Request, res: Response, next: NextFunction) => {
            if (req.session.User) {
                next(createHttpError(403));
                return;
            }

            const token = req.query.token.toString();

            if (!token) {
                next(createHttpError(401));
                return;
            }

            const tokens = await UserToken.FetchAll(UserToken, [
                "User"
            ]);

            const userToken = tokens.filter(x => compareSync(token, x.Token))[0];

            if (!userToken) {
                next(createHttpError(401));
                return;
            }

            const expired = await userToken.CheckIfExpired();

            if (expired) {
                next(createHttpError(401));
                return;
            }

            if (userToken.Type != UserTokenType.Verification) {
                next(createHttpError(401));
                return;
            }

            res.locals.user = userToken.User;
            res.locals.token = token;

            res.render('auth/verify');
        });
    }

    public OnPost(): void {
        const queryValidation = new QueryValidation("token", "/")
                .NotEmpty();

        const bodyValidation = new BodyValidation("password")
                .NotEmpty()
                .MinLength(8)
                .EqualToField("passwordRepeat")
                    .WithMessage("Passwords must match");

        super.router.post('/verify',
            queryValidation.Validate.bind(queryValidation),
            bodyValidation.Validate.bind(bodyValidation),
            async (req: Request, res: Response, next: NextFunction) => {
                const token = req.query.token.toString();

                if (req.session.error) {
                    res.redirect(`/auth/verify?token=${token}`);
                    return;
                }

                const password = req.body.password;
                const passwordRepeat = req.body.passwordRepeat;

                const tokens = await UserToken.FetchAll(UserToken, [
                    "User"
                ]);

                const userToken = tokens.filter(x => compareSync(token, x.Token))[0];

                if (!userToken) {
                    next(createHttpError(401));
                    return;
                }

                const expired = await userToken.CheckIfExpired();

                if (expired) {
                    next(createHttpError(401));
                    return;
                }

                if (userToken.Type != UserTokenType.Verification) {
                    next(createHttpError(401));
                    return;
                }

                const hashed = await hash(password, 10);

                userToken.User.UpdatePassword(hashed);
                userToken.User.Verify();

                await userToken.User.Save(User, userToken.User);
                await UserToken.Remove(UserToken, userToken);

                const message = new MessageHelper(req);
                await message.Info('You are now verified, please now login');

                res.redirect('/auth/login');
            }
        );
    }
}
