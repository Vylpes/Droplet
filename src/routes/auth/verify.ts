import { compareSync, hash } from "bcryptjs";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { UserTokenType } from "../../constants/UserTokenType";
import { Page } from "../../contracts/Page";
import { User } from "../../entity/User";
import UserToken from "../../entity/UserToken";

export default class Verify extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
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
        super.router.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
            const token = req.query.token.toString();
            const password = req.body.password;
            const passwordRepeat = req.body.passwordRepeat;

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

            if (!password || !passwordRepeat) {
                req.session.error = "All fields are required";
                res.redirect(`/auth/verify?token=${token}`);
                return;
            }

            if (password != passwordRepeat) {
                req.session.error = "Passwords must match";
                res.redirect(`/auth/verify?token=${token}`);
                return;
            }

            if (password.length < 8) {
                req.session.error = "Password must be at least 8 characters long";
                res.redirect(`/auth/verify?token=${token}`);
                return;
            }

            const hashed = await hash(password, 10);

            userToken.User.UpdatePassword(hashed);
            userToken.User.Verify();

            await userToken.User.Save(User, userToken.User);
            await UserToken.Remove(UserToken, userToken);

            req.session.success = "You are now verified, please now login";
            res.redirect('/auth/login');
        });
    }
}