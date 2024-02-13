import { Router, Request, Response } from "express";
import Page from "../../contracts/Page";

export class Index implements Page {
    OnGet(req: Request, res: Response) {
        if (res.locals.viewData.isAuthenticated) {
            res.redirect('/dashboard');
        }

        res.render('index/index', res.locals.viewData);
    }
}