import { Request, Response, Router } from "express";
import { Page } from "../../../contracts/Page";
import { User } from "../../../database/entities/User";
import { UserMiddleware } from "../../../middleware/userMiddleware";
import GetAllUsers from "../../../domain/queries/User/GetAllUsers";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/users', UserMiddleware.AdminAuthorise, async (req: Request, res: Response) => {
            const users = await GetAllUsers();

            res.locals.viewData.users = users;

            res.render('settings/users/list', res.locals.viewData);
        });
    }
}