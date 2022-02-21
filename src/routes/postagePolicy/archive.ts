import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import PostagePolicy from "../../entity/PostagePolicy";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Archive extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/:Id/archive', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
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
        });
    }
}