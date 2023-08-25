import { NextFunction, Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { Listing } from "../../database/entities/Listing";
import { Order } from "../../database/entities/Order";
import { Item } from "../../database/entities/Item";

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

            const listing = await Listing.FetchOneById(Listing, listingId, [
                "Items"
            ]);

            const order = await Order.FetchOneById(Order, Id, [
                "Listings"
            ]);

            order.AddListingToOrder(listing);

            await order.Save(Order, order);

            listing.MarkAsSold(amount);

            await listing.Save(Listing, listing);

            for (const item of listing.Items) {
                item.MarkAsSold(amount, ItemStatus.Listed);

                await item.Save(Item, item);
            }

            res.redirect(`/orders/view/${Id}`);
        });
    }
}