import { Router, Request, Response } from "express";
import { Page } from "../../contracts/Page";
import BodyValidation from "../../helpers/Validation/Body";
import MessageHelper from "../../helpers/MessageHelper";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import User from "../../contracts/entities/User/User";
import { compare } from "bcryptjs";

export class Login extends Page {
    constructor(router: Router) {
        super(router);
    }

    OnGet() {
        super.router.get('/login', (req: Request, res: Response) => {
            if (res.locals.viewData.isAuthenticated) {
                res.redirect('/dashboard');
		return;
            }

            res.render('auth/login', res.locals.viewData);
        });
    }

    OnPost() {
        const bodyValidation = new BodyValidation("email", "/auth/login")
                .NotEmpty()
                .EmailAddress()
            .ChangeField("password")
                .NotEmpty();

        super.router.post('/login', bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const email = req.body.email;
            const password = req.body.password;

            const userMaybe = await ConnectionHelper.FindOne<User>("user", { email: email });

            if (!userMaybe.IsSuccess) {
                const message = new MessageHelper(req);
                await message.Error('Your account has been deactivated.');

                res.redirect('/auth/login');
                return;
            }

            const user = userMaybe.Value;

    	    if (!user || !user.active) {
                const message = new MessageHelper(req);
                await message.Error('Your account has been deactivated.');

         		res.redirect('/auth/login');
         		return;
    	    }

            const samePassword = await compare(password, user.password);

            if (samePassword) {
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
        });
    }
}
