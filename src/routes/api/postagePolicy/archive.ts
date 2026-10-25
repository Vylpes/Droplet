import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import PostagePolicy from "../../../database/entities/PostagePolicy";
import { mapPostagePolicy } from "../../../dto";

export default class Archive implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const Id = (req.params.Id as string);

        if (!Id) {
            next(createHttpError(404));
            return;
        }

        const postagePolicy = await PostagePolicy.FetchOneById(PostagePolicy, Id);

        if (!postagePolicy) {
            next(createHttpError(404));
            return;
        }

        postagePolicy.ArchivePolicy();

        await postagePolicy.Save(PostagePolicy, postagePolicy);

        res.json(GenerateResponse(true, "Postage policy archived", mapPostagePolicy(postagePolicy)));
    }
}
