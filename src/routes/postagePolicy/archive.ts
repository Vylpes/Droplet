import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import PostagePolicy from "../../database/entities/PostagePolicy";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ArchivePostagePolicyCommand from "../../domain/commands/PostagePolicy/ArchivePostagePolicyCommand";

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
            
            await ArchivePostagePolicyCommand(Id);

            res.redirect(`/postage-policies`);
        });
    }
}