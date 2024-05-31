import { Request, Response } from "express";
import Page from "../../contracts/Page";

export default class Index implements Page {
    OnGet(req: Request, res: Response) {
        if (res.locals.viewData.isAuthenticated) {
            res.redirect('/dashboard');
            return;
        }

        res.render('index/index', res.locals.viewData);
    }
}