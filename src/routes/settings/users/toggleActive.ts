import { Request, Response, Router } from "express";
import { Page } from "../../../contracts/Page";
import { User } from "../../../entity/User";
import { UserMiddleware } from "../../../middleware/userMiddleware";

export default class ToggleActive extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/users/:id/toggle-active', UserMiddleware.AdminAuthorise, async (req: Request, res: Response) => {
            const id = req.params.id;
	        const currentUser = req.session.User;

            if (!id) {
                req.session.error = "User not found";
                res.redirect('/settings/users');
                return;
            }

            const user = await User.FetchOneById(User, id);

            if (!user) {
                req.session.error = "User not found";
                res.redirect('/settings/users');
                return;
            }

    	    if (user.Id == currentUser.Id) {
           		req.session.error = "You can not deactivate yourself.";
                res.redirect(`/settings/users/${id}`);
                return;
    	    }

    	    user.ToggleActive();

            await user.Save(User, user);

            res.redirect(`/settings/users/${id}`);
        });
    }
}
