import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import { ListingStatus } from "../../constants/Status/ListingStatus";
import EndListingCommand from "../../domain/commands/Listing/EndListingCommand";

export default class End extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/end', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            await EndListingCommand(Id);

            res.redirect('/listings/active');
        });
    }
}