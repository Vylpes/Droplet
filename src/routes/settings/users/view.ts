import { Request, Response, Router } from "express";
import { Page } from "../../../contracts/Page";
import { User } from "../../../entity/User";
import { UserMiddleware } from "../../../middleware/userMiddleware";

export default class View extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/users/:id', UserMiddleware.AdminAuthorise, async (req: Request, res: Response) => {
            const id = req.params.id;

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

            res.locals.viewData.user = user;

            res.render('settings/users/view', res.locals.viewData);
        });
    }
}