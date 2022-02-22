import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Calculator extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/calculator', UserMiddleware.Authorise, (req: Request, res: Response) => {
            res.render('dashboard/calculator', res.locals.viewData);
        });
    }
}