import { hash } from "bcryptjs";
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import BodyValidation from "../../helpers/Validation/Body";
import MessageHelper from "../../helpers/MessageHelper";
import { v4 } from "uuid";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import User from "../../domain/models/User/User";

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

            const user: User = {
                uuid: v4(),
                email: email,
                username: username,
                password: hashedPassword,
                active: true,
                verified: true,
                admin: true,
                whenCreated: new Date(),
                tokens: [],
            };

            await ConnectionHelper.InsertOne<User>("user", user);

            const message = new MessageHelper(req);
            await message.Info('Successfully registered admin user');

            res.redirect('/');
        });
    }

    private async CanViewChecks(req: Request, res: Response, next: NextFunction) {
        if (req.session.User) {
            next(createHttpError(403));
        }

        if (await ConnectionHelper.Any<User>("user")) {
            next(createHttpError(403));
        }

        next();
    }
}
