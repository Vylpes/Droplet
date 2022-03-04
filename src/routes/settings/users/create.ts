import { hash } from "bcryptjs";
import { Request, Response, Router } from "express";
import { UserTokenType } from "../../../constants/UserTokenType";
import { Page } from "../../../contracts/Page";
import { User } from "../../../entity/User";
import UserToken from "../../../entity/UserToken";
import EmailHelper from "../../../helpers/EmailHelper";
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
                return;
            }

            const userByUsername = await User.FetchOneByUsername(username);
            const userByEmail = await User.FetchOneByEmail(email);

            if (userByUsername || userByEmail) {
                req.session.error = "Username and Email must be unique";
                res.redirect('/settings/users');
                return;
            }

            let user = new User(email, username, await PasswordHelper.GenerateRandomHashedPassword(), false, admin == "true", true);

            await user.Save(User, user);

            user = await User.FetchOneById(User, user.Id, [
                "Tokens"
            ]);

            const now = new Date();

            const tokenExpiryDate = new Date(now.getTime() + (1000 * 60 * 60 * 24 * 2)) // 2 days

            const token = await PasswordHelper.GenerateRandomToken();
            const hashedToken = await hash(token, 10);

            const userToken = new UserToken(hashedToken, tokenExpiryDate, UserTokenType.Verification);

            await userToken.Save(UserToken, userToken);

            user.AddTokenToUser(userToken);

            await user.Save(User, user);

            await EmailHelper.SendEmail(user.Email, "VerifyUser", [{
                key: "username",
                value: user.Username,
            }, {
                key: "verify_link",
                value: `http://localhost:3000/auth/verify?token=${token}`,
            }]);

            req.session.success = "Successfully created user";
            res.redirect('/settings/users');
        });
    }
}