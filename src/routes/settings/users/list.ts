import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { User } from "../../../database/entities/User";

export default class List implements Page {
    public async OnGetAsync(req: Request, res: Response) {
        const users = await User.FetchAll(User);

        res.locals.viewData.users = users;

        res.render('settings/users/list', res.locals.viewData);
    }
}