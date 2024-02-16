import { Request, Response } from "express";
import Page from "../../contracts/Page";

export default class Calculator implements Page {
    public OnGet(req: Request, res: Response): void {
        res.render('dashboard/calculator', res.locals.viewData);
    }
}