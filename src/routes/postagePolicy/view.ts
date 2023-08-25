import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import PostagePolicy from "../../database/entities/PostagePolicy";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class View extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }

            const policy = await PostagePolicy.FetchOneById(PostagePolicy, Id, [
                "Listings"
            ]);

            if (!policy) {
                next(createHttpError(404));
            }

            res.locals.viewData.policy = policy;

            res.render('postage-policies/view', res.locals.viewData);
        });
    }
}