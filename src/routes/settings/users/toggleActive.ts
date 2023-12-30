import { Request, Response, Router } from "express";
import { Page } from "../../../contracts/Page";
import { User } from "../../../database/entities/User";
import { UserMiddleware } from "../../../middleware/userMiddleware";
import MessageHelper from "../../../helpers/MessageHelper";
import GetOneUserById from "../../../domain/queries/User/GetOneUserById";
import ToggleUserActiveCommand from "../../../domain/commands/User/ToggleUserActiveCommand";

export default class ToggleActive extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/users/:id/toggle-active', UserMiddleware.AdminAuthorise, async (req: Request, res: Response) => {
            const id = req.params.id;
	        const currentUser = req.session.User;

            if (!id) {
                const message = new MessageHelper(req);
                await message.Error('User not found');

                res.redirect('/settings/users');
                return;
            }

            const user = await GetOneUserById(id);

            if (!user) {
                const message = new MessageHelper(req);
                await message.Error('User not found');

                res.redirect('/settings/users');
                return;
            }

    	    if (user.uuid == currentUser.uuid) {
                const message = new MessageHelper(req);
                await message.Error('You can not deactivate yourself');

                res.redirect(`/settings/users/${id}`);
                return;
    	    }

    	    await ToggleUserActiveCommand(id);
            
            res.redirect(`/settings/users/${id}`);
        });
    }
}
