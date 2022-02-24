import { hash } from "bcryptjs";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { User } from "../../entity/User";

export default class AdminRegister extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/admin-register', this.CanViewChecks, async (req: Request, res: Response) => {
            res.render('auth/admin-register', res.locals.viewData);
        });
    }

    public OnPost(): void {
        super.router.post('/admin-register', this.CanViewChecks, async (req: Request, res: Response) => {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const passwordRepeat = req.body.passwordRepeat;

            if (!username || !email || !password || !passwordRepeat) {
                req.session.error = "All fields are required";
                res.redirect('/auth/admin-register');
                return;
            }

            if (password != passwordRepeat) {
                req.session.error = "Passwords do not match";
                res.redirect('/auth/admin-register');
                return;
            }

            const hashedPassword = await hash(password, 10);

            const user = new User(email, username, hashedPassword, true, true, true);

            await user.Save(User, user);

            req.session.success = "Successfully registered admin user";
            res.redirect('/');
        });
    }

    private async CanViewChecks(req: Request, res: Response, next: NextFunction) {
        if (req.session.User) {
            next(createHttpError(403));
        }

        if (await User.Any(User)) {
            next(createHttpError(403));
        }

        next();
    }
}