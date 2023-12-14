import { NextFunction, Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { Listing } from "../../database/entities/Listing";
import { Item } from "../../database/entities/Item";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Order from "../../contracts/entities/Order/Order";

export default class AssignListing extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("listingId")
                .NotEmpty()
            .ChangeField("amount")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/assign-listing', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/orders/view/${Id}`);
                return;
            }

            const listingId = req.body.listingId;
            const amount = req.body.amount;

            await ConnectionHelper.UpdateOne<Order>("order", { uuid: Id }, { $push: { r_listings: listingId }});

            res.redirect(`/orders/view/${Id}`);
        });
    }
}