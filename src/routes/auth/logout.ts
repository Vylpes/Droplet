import { Router, Request, Response, NextFunction } from "express";
import Page from "../../contracts/Page";

export default class Logout implements Page {
    OnGet(req: Request, res: Response, next: NextFunction) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
}