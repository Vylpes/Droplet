import { Router, Request, Response } from "express";
import { Page } from "../../contracts/Page";
import { User } from "../../entity/User";

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
        super.router.post('/login', async (req: Request, res: Response) => {
            const email = req.body.email;
            const password = req.body.password;

            if (!email || !password) {
                req.session.error = "All fields are required";
                res.redirect('/auth/login');
                return;
            }

	    const user = await User.FetchOneByEmail(email);

	    if (!user || !user.Active) {
		req.session.error = "Your account has been deactivated.";
		res.redirect('/auth/login');

		return;
	    }

            if (await User.IsLoginCorrect(email, password)) {
                req.session.regenerate(async () => {
                    req.session.User = user;
    
                    res.redirect('/dashboard');
                });
            } else {
                req.session.error = "Password is incorrect";
                res.redirect('/auth/login');
            }
        });
    }
}
