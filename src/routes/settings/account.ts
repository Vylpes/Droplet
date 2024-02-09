import { hash } from "bcryptjs";
import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { User } from "../../database/entities/User";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import MessageHelper from "../../helpers/MessageHelper";

export default class Account extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/account', UserMiddleware.Authorise, (req: Request, res: Response) => {
            const user = req.session.User;

            res.locals.viewData.user = user;

            res.render('settings/account', res.locals.viewData);
        });
    }

    public OnPost(): void {
        const bodyValidation = new Body("email", "/settings/account")
                .NotEmpty()
            .ChangeField("currentPassword")
                .NotEmpty()
                    .WithMessage("Your current password is required to make changes")
            .ChangeField("newPassword")
                .EqualToField("passwordConfirm")
                    .WithMessage("Passwords must match")
            .ChangeField("username")
                .NotEmpty();

        super.router.post('/account', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const user = req.session.User;
            const email = req.body.email;
            const currentPassword = req.body.currentPassword;
            const newPassword = req.body.newPassword;
            const username = req.body.username;

            if (!email || !currentPassword || !username) {
                const message = new MessageHelper(req);
                await message.Error('Email, Current Password, and Username are required');

                res.redirect('/settings/account');
                return;
            }

            if (!await User.IsLoginCorrect(user.Email, currentPassword)) {
                const message = new MessageHelper(req);
                await message.Error('Your password is incorrect');

                res.redirect('/settings/account');
                return;
            }

            const userFromDb = await User.FetchOneById(User, user.Id);

            if (!userFromDb)
            {
                req.session.error = "Sorry an error has occurred.";
                res.redirect('/settings/account');
                return;
            }

            // TODO: Check if email and username already exist
            userFromDb.UpdateBasicDetails(email, username, user.Admin, user.Active);

            if (newPassword) {
                const hashedPassword = await hash(newPassword, 10);
                user.UpdatePassword(hashedPassword);
            }

            await userFromDb.Save(User, userFromDb);

            req.session.User = userFromDb;

            res.redirect('/settings/account');
        });
    }
}