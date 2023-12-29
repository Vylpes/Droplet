import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Return } from "../../database/entities/Return";
import { UserMiddleware } from "../../middleware/userMiddleware";
import UpdateReturnStatusCommand from "../../domain/commands/Return/UpdateReturnStatusCommand";
import { ReturnStatus } from "../../constants/Status/ReturnStatus";

export default class Posted extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/posted', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;
            
            await UpdateReturnStatusCommand(Id, ReturnStatus.ItemPosted);

            res.redirect(`/returns/view/${Id}`);
        });
    }
}