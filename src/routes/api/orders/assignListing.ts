import { NextFunction, Request, Response } from "express";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { Listing } from "../../../database/entities/Listing";
import { Order } from "../../../database/entities/Order";
import { Item } from "../../../database/entities/Item";
import { mapOrder } from "../../../dto";

export default class AssignListing implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("listingId")
                .NotEmpty()
            .ChangeField("amount")
                .NotEmpty()
                .Number();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const listingId = req.body.listingId;
        const amount = req.body.amount;

        const listing = await Listing.FetchOneById(Listing, listingId, {
            Items: true
        });

        const order = await Order.FetchOneById(Order, Id, {
            Listings: true
        });

        order.AddListingToOrder(listing);

        await order.Save(Order, order);

        listing.MarkAsSold(amount);

        await listing.Save(Listing, listing);

        for (const item of listing.Items) {
            item.MarkAsSold(amount, ItemStatus.Listed);

            await item.Save(Item, item);
        }

        res.json(GenerateResponse(true, "Listing assigned", mapOrder(order, true)));
    }
}
