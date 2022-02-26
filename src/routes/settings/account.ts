import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { User } from "../../entity/User";
import { UserMiddleware } from "../../middleware/userMiddleware";

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
        super.router.post('/account', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const user = req.session.User;
            const email = req.body.email;
            const currentPassword = req.body.currentPassword;
            const newPassword = req.body.newPassword;
            const passwordConfirm = req.body.passwordConfirm;
            const username = req.body.username;

            if (!email || !currentPassword || !username) {
                req.session.error = "Email, Current Password, and Username are required";
                res.redirect('/settings/account');
                return;
            }

            if (!await User.IsLoginCorrect(user.Email, currentPassword)) {
                req.session.error = "Your password was incorrect";
                res.redirect('/settings/account');
                return;
            }

            if (newPassword && (newPassword != passwordConfirm)) {
                req.session.error = "Passwords must match";
                res.redirect('/settings/account');
                return;
            }

            user.UpdateBasicDetails(email, username, user.Admin, user.Active);

            await user.Save(User, user);

            res.redirect('/settings/account');
        });
    }
}