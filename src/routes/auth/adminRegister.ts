import { hash } from "bcryptjs";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import Page from "../../contracts/Page";
import { User } from "../../database/entities/User";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import MessageHelper from "../../helpers/MessageHelper";

export default class AdminRegister implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        if (req.session.User || await User.Any(User)) {
            next(createHttpError(403));
            return;
        }

        res.render('auth/admin-register', res.locals.viewData);
    }

    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        if (req.session.User || await User.Any(User)) {
            next(createHttpError(403));
            return;
        }

        const bodyValidation = new BodyValidator("username")
                .NotEmpty()
            .ChangeField("email")
                .NotEmpty()
                .EmailAddress()
            .ChangeField("password")
                .NotEmpty()
            .ChangeField("passwordRepeat")
                .NotEmpty()
                .EqualToField("password")
                    .WithMessage("Passwords do not match");

        if (!await bodyValidation.Validate(req)) {
            res.redirect("/auth/admin-register");
            return;
        }

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const hashedPassword = await hash(password, 10);

        const user = new User(email, username, hashedPassword, true, true, true);

        await user.Save(User, user);

        const message = new MessageHelper(req);
        await message.Info('Successfully registered admin user');

        res.redirect('/');
    }
}
