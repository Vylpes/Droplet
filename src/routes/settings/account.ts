import { hash } from "bcryptjs";
import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { User } from "../../database/entities/User";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import MessageHelper from "../../helpers/MessageHelper";
import GetOneUserById from "../../domain/queries/User/GetOneUserById";
import UpdateUserBasicDetailsCommand from "../../domain/commands/User/UpdateUserBasicDetailsCommand";
import UpdateUserPasswordCommand from "../../domain/commands/User/UpdateUserPasswordCommand";

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

            await UpdateUserBasicDetailsCommand(user.uuid, email, username, user.admin, user.active);

            if (newPassword) {
                const hashedPassword = await hash(newPassword, 10);
                await UpdateUserPasswordCommand(user.uuid, hashedPassword);
            }

            res.redirect('/settings/account');
        });
    }
}