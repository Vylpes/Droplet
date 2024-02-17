import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { User } from "../../../database/entities/User";
import BodyValidator from "../../../helpers/Validation/BodyValidator";
import MessageHelper from "../../../helpers/MessageHelper";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("username")
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

        const id = req.params.id;

        if (!await bodyValidation.Validate(req)) {
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
    }
}