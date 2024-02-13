import { Router, Request, Response, NextFunction } from "express";
import Page from "../../contracts/Page";
import { User } from "../../database/entities/User";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import { sys } from "typescript";
import { threadId } from "worker_threads";
import MessageHelper from "../../helpers/MessageHelper";

export class Login implements Page {
    OnGet(req: Request, res: Response, next: NextFunction) {
        if (res.locals.viewData.isAuthenticated) {
            res.redirect('/dashboard');
            return;
        }

        res.render('auth/login', res.locals.viewData);
    }

    async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("email")
                .NotEmpty()
                .EmailAddress()
            .ChangeField("password")
                .NotEmpty();

        if (!await bodyValidation.Validate(req)) {
            res.redirect("/auth/login");
            return;
        }

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.FetchOneByEmail(email);

        if (!user || !user.Active) {
            const message = new MessageHelper(req);
            await message.Error('Your account has been deactivated.');

            res.redirect('/auth/login');
            return;
        }

        if (await User.IsLoginCorrect(email, password)) {
            req.session.regenerate(async () => {
                req.session.User = user;

                req.session.save(() => {
                    res.redirect('/dashboard');
                });
            });
        } else {
            const message = new MessageHelper(req);
            await message.Error('Password is incorrect')

            res.redirect('/auth/login');
        }
    }
}
