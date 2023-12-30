import { hash } from "bcryptjs";
import { Request, Response, Router } from "express";
import { UserTokenType } from "../../../constants/UserTokenType";
import { Page } from "../../../contracts/Page";
import { User } from "../../../database/entities/User";
import UserToken from "../../../database/entities/UserToken";
import EmailHelper from "../../../helpers/EmailHelper";
import PasswordHelper from "../../../helpers/PasswordHelper";
import Body from "../../../helpers/Validation/Body";
import { UserMiddleware } from "../../../middleware/userMiddleware";
import MessageHelper from "../../../helpers/MessageHelper";
import GetOneUserByUsername from "../../../domain/queries/User/GetOneUserByUsername";
import GetOneUserByEmail from "../../../domain/queries/User/GetOneUserByEmail";
import CreateNewUserCommand from "../../../domain/commands/User/CreateNewUserCommand";
import AddTokenToUserCommand from "../../../domain/commands/User/AddTokenToUserCommand";
import EmailUserVerificationTokenIntegrationEvent from "../../../domain/integrationEvents/EmailUserVerificationTokenIntegrationEvent";

export default class Create extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("username", "/settings/users")
                .NotEmpty()
            .ChangeField("email")
                .NotEmpty()
                .EmailAddress()
            .ChangeField("admin")
                .NotEmpty()
                .Boolean();

        super.router.post('/users/create', UserMiddleware.AdminAuthorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const username = req.body.username;
            const email = req.body.email;
            const admin = req.body.admin;

            const userByUsername = await GetOneUserByUsername(username);
            const userByEmail = await GetOneUserByEmail(email);

            if (userByUsername || userByEmail) {
                const message = new MessageHelper(req);
                await message.Error('Username and Email must be unique');

                res.redirect('/settings/users');
                return;
            }

            const user = await CreateNewUserCommand(username, email, admin);

            const now = new Date();

            const tokenExpiryDate = new Date(now.getTime() + (1000 * 60 * 60 * 24 * 2)) // 2 days

            const token = await PasswordHelper.GenerateRandomToken();
            const hashedToken = await hash(token, 10);

            await AddTokenToUserCommand(user.uuid, hashedToken, tokenExpiryDate, UserTokenType.Verification);
            await EmailUserVerificationTokenIntegrationEvent(email, username, token);

            const message = new MessageHelper(req);
            await message.Info('Successfully created user');

            res.redirect('/settings/users');
        });
    }
}