import { hash } from "bcryptjs";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { User } from "../../entity/User";
import BodyValidation from "../../helpers/Validation/Body";

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
        const bodyValidation = new BodyValidation("username", "/auth/admin-register")
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

        super.router.post('/admin-register', this.CanViewChecks, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;

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
