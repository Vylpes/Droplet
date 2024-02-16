import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Page from "../../contracts/Page";
import PostagePolicy from "../../database/entities/PostagePolicy";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
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
    }
}