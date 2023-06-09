import { Request, Response, Router } from "express";
import { Page } from "../../../contracts/Page";
import { User } from "../../../entity/User";
import Body from "../../../helpers/Validation/Body";
import { UserMiddleware } from "../../../middleware/userMiddleware";
import MessageHelper from "../../../helpers/MessageHelper";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("username")
                .NotEmpty()
            .ChangeField("email")
                .NotEmpty()
                .EmailAddress()
            .ChangeField("admin")
                .NotEmpty()
                .Boolean()
            .ChangeField("active")
                .NotEmpty()
                .Boolean();

        super.router.post('/users/:id/update', UserMiddleware.AdminAuthorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const id = req.params.id;

            if (req.session.error) {
                res.redirect(`/settings/users/${id}`);
                return;
            }

            const user = await User.FetchOneById(User, id);

            if (!user) {
                const message = new MessageHelper(req);
                await message.Error('User not found');

                res.redirect('/settings/users');
                return;
            }

            const username = req.body.username;
            const email = req.body.email;
            const admin = req.body.admin;
            const active = req.body.active;

            const adminBool = admin == 'true';
            const activeBool = active == 'true';

            user.UpdateBasicDetails(email, username, adminBool, activeBool);

            await user.Save(User, user);

            res.redirect(`/settings/users/${id}`);
        });
    }
}