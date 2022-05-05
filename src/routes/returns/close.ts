import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Return } from "../../entity/Return";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Close extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/close', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            const ret = await Return.FetchOneById(Return, Id);
            
            ret.MarkAsClosed();

            await ret.Save(Return, ret);

            res.redirect(`/returns/view/${Id}`);
        });
    }
}