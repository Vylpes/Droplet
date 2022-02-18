import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { Return } from "../../entity/Return";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/view/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }

            const ret = await Return.FetchOneById(Return, Id, [
                "TrackingNumbers",
                "Order"
            ]);

            if (!ret) {
                next(createHttpError(404));
            }

            res.locals.viewData.ret = ret;

            res.render('returns/view', res.locals.viewData);
        });
    }
}