import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import PostagePolicy from "../../../database/entities/PostagePolicy";
import { mapPostagePolicy } from "../../../dto";

export default class List implements Page {
    public async OnGetAsync(req: Request, res: Response, _next: NextFunction) {
        const policies = await PostagePolicy.FetchAll(PostagePolicy, {
            Listings: true
        });

        res.json(GenerateResponse(true, undefined, policies.filter(x => !x.Archived).map(mapPostagePolicy)));
    }
}
