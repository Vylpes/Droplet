import { Router, Request, Response } from "express";
import { Page } from "../../contracts/Page";
import { User } from "../../entity/User";
import BodyValidation from "../../helpers/Validation/Body";
import { sys } from "typescript";
import { threadId } from "worker_threads";
import MessageHelper from "../../helpers/MessageHelper";

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
        });
    }
}
