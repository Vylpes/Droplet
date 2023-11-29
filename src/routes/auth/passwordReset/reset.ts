import { compareSync, hash } from "bcryptjs";
import { NextFunction, query, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { UserTokenType } from "../../../constants/UserTokenType";
import { Page } from "../../../contracts/Page";
import UserToken from "../../../database/entities/UserToken";
import Body from "../../../helpers/Validation/Body";
import Query from "../../../helpers/Validation/Query";
import MessageHelper from "../../../helpers/MessageHelper";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import User from "../../../contracts/entities/User/User";

export default class Reset extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        const queryValidation = new Query("token", "/")
                .NotEmpty();

        super.router.get('/password-reset/reset', queryValidation.Validate.bind(queryValidation), async (req: Request, res: Response, next: NextFunction) => {
            if (req.session.User) {
                next(createHttpError(403));
                return;
            }

            const username = req.query.username.toString();
            const token = req.query.token.toString();

            const userMaybe = await ConnectionHelper.FindOne<User>("user", { username: username });

            if (!userMaybe.IsSuccess) {
                next(createHttpError(401));
                return;
            }

            const user = userMaybe.Value;

            const userToken = user.tokens.filter(x => compareSync(token, x.token))[0];

            if (!userToken) {
                next(createHttpError(401));
                return;
            }

            const expired = new Date() > userToken.expires;

            if (expired) {
                next(createHttpError(401));
                return;
            }

            if (userToken.type != UserTokenType.PasswordReset) {
                next(createHttpError(401));
                return;
            }

            res.locals.user = user;
            res.locals.token = token;

            res.render('auth/password-reset/reset');
        });
    }

    public OnPost(): void {
        const queryValidation = new Query("token", "/")
                .NotEmpty();

        const bodyValidation = new Body("password")
                .NotEmpty()
                .MinLength(8)
                .EqualToField("passwordRepeat");

        super.router.post('/password-reset/reset',
            queryValidation.Validate.bind(queryValidation),
            bodyValidation.Validate.bind(bodyValidation),
            async (req: Request, res: Response, next: NextFunction) => {
                const username = req.query.username.toString();
                const token = req.query.token.toString();

                if (req.session.error) {
                    res.redirect(`/auth/password-reset/reset?token=${token}`);
                    return;
                }

                const password = req.body.password;
                const passwordRepeat = req.body.passwordRepeat;

                if (!password) {
                    const message = new MessageHelper(req);
                    await message.Error("Password is required");

                    res.redirect(`/auth/password-reset/reset?token=${token}`);
                    return;
                }

                if (password.length < 8) {
                    const message = new MessageHelper(req);
                    await message.Error("Password must be no less than 8 characters long");

                    res.redirect(`/auth/password-reset/reset?token=${token}`);
                    return;
                }

                if (password != passwordRepeat) {
                    const message = new MessageHelper(req);
                    await message.Error("Passwords must be the same");

                    res.redirect(`/auth/password-reset/reset?token=${token}`);
                    return;
                }

                const userMaybe = await ConnectionHelper.FindOne<User>("user", { username: username });

                if (!userMaybe.IsSuccess) {
                    next(createHttpError(401));
                    return;
                }

                const user = userMaybe.Value;

                const userToken = user.tokens.filter(x => compareSync(token, x.token))[0];

                if (!userToken) {
                    next(createHttpError(401));
                    return;
                }

                const expired = new Date() > userToken.expires;

                if (expired) {
                    next(createHttpError(401));
                    return;
                }

                if (userToken.type != UserTokenType.PasswordReset) {
                    next(createHttpError(401));
                    return;
                }

                const hashed = await hash(password, 10);
                const updatedTokens = user.tokens.filter(x => x.token != token);

                await ConnectionHelper.UpdateOne<User>("user", { uuid: user.uuid }, { $set: { password: hashed, tokens: updatedTokens } } );

                const message = new MessageHelper(req);
                await message.Info('Your password has been reset, please now login');

                res.redirect('/auth/login');
            }
        );
    }
}