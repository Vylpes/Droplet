import { compareSync, hash } from "bcryptjs";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { UserTokenType } from "../../constants/UserTokenType";
import { Page } from "../../contracts/Page";
import BodyValidation from "../../helpers/Validation/Body";
import QueryValidation from "../../helpers/Validation/Query";
import MessageHelper from "../../helpers/MessageHelper";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import User from "../../contracts/entities/User/User";

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

            const username = req.query.username.toString();
            const token = req.query.token.toString();

            if (!username || !token) {
                next(createHttpError(401));
                return;
            }

            const userMaybe = await ConnectionHelper.FindOne<User>("user", { username: username });

            if (!userMaybe.IsSuccess) {
                next(createHttpError(401));
                return;
            }

            const user = userMaybe.Value!;

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

            if (userToken.type != UserTokenType.Verification) {
                next(createHttpError(401));
                return;
            }

            res.locals.user = user;
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
                const username = req.query.username.toString();
                const token = req.query.token.toString();

                if (req.session.error) {
                    res.redirect(`/auth/verify?token=${token}&username=${username}`);
                    return;
                }

                const password = req.body.password;
                const passwordRepeat = req.body.passwordRepeat;

                const userMaybe = await ConnectionHelper.FindOne<User>("user", { username: username });

                if (!userMaybe.IsSuccess) {
                    next(createHttpError(401));
                    return;
                }

                const user = userMaybe.Value!;

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

                if (userToken.type != UserTokenType.Verification) {
                    next(createHttpError(401));
                    return;
                }

                const hashed = await hash(password, 10);

                await ConnectionHelper.UpdateOne<User>("user", { uuid: user.uuid }, { $set: { password: hashed, verified: true }});

                const message = new MessageHelper(req);
                await message.Info('You are now verified, please now login');

                res.redirect('/auth/login');
            }
        );
    }
}
