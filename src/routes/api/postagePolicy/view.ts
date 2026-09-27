import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import PostagePolicy from "../../../database/entities/PostagePolicy";
import { mapPostagePolicy } from "../../../dto";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const id = (req.params.id as string);

        if (!id) {
            next(createHttpError(404));
            return;
        }

        const policy = await PostagePolicy.FetchOneById(PostagePolicy, id, {
            Listings: true
        });

        if (!policy) {
            next(createHttpError(404));
            return;
        }

        res.json(GenerateResponse(true, undefined, mapPostagePolicy(policy)));
    }
}
