import { compareSync, hash } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { UserTokenType } from "../../../constants/UserTokenType";
import Page from "../../../contracts/Page";
import { User } from "../../../database/entities/User";
import UserToken from "../../../database/entities/UserToken";
import BodyValidator from "../../../helpers/Validation/BodyValidator";
import QueryValidator from "../../../helpers/Validation/QueryValidator";
import MessageHelper from "../../../helpers/MessageHelper";

export default class Reset implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const queryValidation = new QueryValidator("token")
                .NotEmpty();

        if (!await queryValidation.Validate(req)) {
            res.redirect("/");
            return;
        }

        if (req.session.User) {
            next(createHttpError(403));
            return;
        }

        const token = req.query.token.toString();

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

        if (userToken.Type != UserTokenType.PasswordReset) {
            next(createHttpError(401));
            return;
        }

        res.locals.user = userToken.User;
        res.locals.token = token;

        res.render('auth/password-reset/reset');
    }

    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const queryValidation = new QueryValidator("token")
                .NotEmpty();

        if (!queryValidation.Validate(req)) {
            res.redirect("/");
            return;
        }

        const token = req.query.token.toString();

        const bodyValidation = new BodyValidator("password")
                .NotEmpty()
                .MinLength(8)
                .EqualToField("passwordRepeat");

        if (!bodyValidation.Validate(req)) {
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

        if (userToken.Type != UserTokenType.PasswordReset) {
            next(createHttpError(401));
            return;
        }

        const hashed = await hash(password, 10);

        userToken.User.UpdatePassword(hashed);

        await userToken.User.Save(User, userToken.User);
        await UserToken.Remove(UserToken, userToken);

        const message = new MessageHelper(req);
        await message.Info('Your password has been reset, please now login');

        res.redirect('/auth/login');
    }
}