import { Request, Response } from "express";
import Page from "../../contracts/Page";

export class Index implements Page {
    OnGet(req: Request, res: Response) {
        res.render('dashboard/index', res.locals.viewData);
    }
}