import { Request, Response, Router } from "express";
import { Page } from "../../../contracts/Page";
import { User } from "../../../entity/User";
import PasswordHelper from "../../../helpers/PasswordHelper";
import { UserMiddleware } from "../../../middleware/userMiddleware";

export default class Create extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/users/create', UserMiddleware.AdminAuthorise, async (req: Request, res: Response) => {
            const username = req.body.username;
            const email = req.body.email;
            const admin = req.body.admin;
            
            if (!username || !email || !admin) {
                req.session.error = "All fields are required";
                res.redirect('/settings/users');
            }

            const userByUsername = await User.FetchOneByUsername(username);
            const userByEmail = await User.FetchOneByEmail(email);

            if (userByUsername || userByEmail) {
                req.session.error = "Username and Email must be unique";
                res.redirect('/settings/users');
            }

            const user = new User(email, username, await PasswordHelper.GenerateRandomHashedPassword(), false, admin == "true", true);

            await user.Save(User, user);

            req.session.success = "Successfully created user";
            res.redirect('/settings/users');
        });
    }
}