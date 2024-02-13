import { NextFunction, Request, Response } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import Page from "../../contracts/Page";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import { Listing } from "../../database/entities/Listing";
import { Order } from "../../database/entities/Order";
import { Item } from "../../database/entities/Item";

export default class AssignListing implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("listingId")
                .NotEmpty()
            .ChangeField("amount")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
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
    }
}