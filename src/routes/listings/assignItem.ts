import { NextFunction, Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import MessageHelper from "../../helpers/MessageHelper";
import AssignItemToListingCommand from "../../domain/commands/Listing/AssignItemToListingCommand";

export default class AssignItem extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("itemId")
                .NotEmpty();

        super.router.post('/view/:Id/assign-item', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/listings/view/${Id}`);
                return;
            }

            const itemId = req.body.itemId;

            await AssignItemToListingCommand(Id, itemId);

            res.redirect(`/listings/view/${Id}`);
        });
    }
}