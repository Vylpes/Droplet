import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Return } from "../../database/entities/Return";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Posted extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/posted', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            const ret = await Return.FetchOneById(Return, Id);

            ret.MarkAsPosted();

            await ret.Save(Return, ret);

            res.redirect(`/returns/view/${Id}`);
        });
    }
}