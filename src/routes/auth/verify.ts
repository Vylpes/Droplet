import { compareSync, hash } from "bcryptjs";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { UserTokenType } from "../../constants/UserTokenType";
import Page from "../../contracts/Page";
import { User } from "../../database/entities/User";
import UserToken from "../../database/entities/UserToken";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import QueryValidator from "../../helpers/Validation/QueryValidator";
import MessageHelper from "../../helpers/MessageHelper";

export default class Verify implements Page {
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

        if (userToken.Type != UserTokenType.Verification) {
            next(createHttpError(401));
            return;
        }

        res.locals.user = userToken.User;
        res.locals.token = token;

        res.render('auth/verify');
    }

    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const queryValidation = new QueryValidator("token")
                .NotEmpty();

        if (!await queryValidation.Validate(req)) {
            res.redirect("/");
            return;
        }

        const token = req.query.token.toString();

        const bodyValidation = new BodyValidator("password")
                .NotEmpty()
                .MinLength(8)
                .EqualToField("passwordRepeat")
                    .WithMessage("Passwords must match");

        if (!await bodyValidation.Validate(req)) {
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
}
