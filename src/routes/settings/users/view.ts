import { Request, Response, Router } from "express";
import { Page } from "../../../contracts/Page";
import { User } from "../../../entity/User";
import { UserMiddleware } from "../../../middleware/userMiddleware";
import MessageHelper from "../../../helpers/MessageHelper";

export default class View extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/users/:id', UserMiddleware.AdminAuthorise, async (req: Request, res: Response) => {
            const id = req.params.id;

            if (!id) {
                const message = new MessageHelper(req);
                await message.Error('User not found');

                res.redirect('/settings/users');
                return;
            }

            const user = await User.FetchOneById(User, id);

            if (!user) {
                const message = new MessageHelper(req);
                await message.Error('User not found');

                res.redirect('/settings/users');
                return;
            }

            res.locals.viewData.user = user;

            res.render('settings/users/view', res.locals.viewData);
        });
    }
}