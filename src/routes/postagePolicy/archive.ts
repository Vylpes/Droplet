import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Page from "../../contracts/Page";
import PostagePolicy from "../../database/entities/PostagePolicy";

export default class Archive implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const Id = req.params.Id;

        if (!Id) {
            next(createHttpError(404));
        }

        const postagePolicy = await PostagePolicy.FetchOneById(PostagePolicy, Id);

        if (!postagePolicy) {
            next(createHttpError(404));
        }

        postagePolicy.ArchivePolicy();

        await postagePolicy.Save(PostagePolicy, postagePolicy);

        res.redirect(`/postage-policies`);
    }
}