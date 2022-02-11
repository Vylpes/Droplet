import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { Supply } from "../../entity/Supply";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }

            const supply = await Supply.FetchOneById<Supply>(Supply, Id, [
                "Purchase"
            ]);

            if (!supply) {
                next(createHttpError(404));
            }

            res.locals.item = supply;

            res.render('supplies/view', res.locals.viewData);
        });
    }
}