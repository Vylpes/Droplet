import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import PostagePolicy from "../../database/entities/PostagePolicy";

export default class List implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const policies = await PostagePolicy.FetchAll(PostagePolicy, [
            "Listings"
        ]);

        res.locals.viewData.policies = policies.filter(x => !x.Archived);

        res.render('postage-policies/list', res.locals.viewData);
    }
}