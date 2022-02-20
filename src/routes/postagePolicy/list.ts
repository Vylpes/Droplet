import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import PostagePolicy from "../../entity/PostagePolicy";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const policies = await PostagePolicy.FetchAll(PostagePolicy, [
                "Listings"
            ]);

            res.locals.viewData.policies = policies.filter(x => !x.Archived);

            res.render('postage-policies/list', res.locals.viewData);
        });
    }
}