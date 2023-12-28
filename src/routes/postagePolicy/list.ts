import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import PostagePolicy from "../../database/entities/PostagePolicy";
import { UserMiddleware } from "../../middleware/userMiddleware";
import GetAllPostagePoliciesNotArchived from "../../domain/queries/PostagePolicy/GetAllPostagePoliciesNotArchived";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const policies = await GetAllPostagePoliciesNotArchived();

            res.locals.viewData.policies = policies;

            res.render('postage-policies/list', res.locals.viewData);
        });
    }
}