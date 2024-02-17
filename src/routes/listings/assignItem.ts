import { NextFunction, Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import Page from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { Listing } from "../../database/entities/Listing";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AssignItem implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("itemId")
                .NotEmpty();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/listings/view/${Id}`);
            return;
        }

        const itemId = req.body.itemId;

        const item = await Item.FetchOneById(Item, itemId);

        const listing = await Listing.FetchOneById(Listing, Id, [
            "Items"
        ]);

        listing.AddItemToListing(item);

        await listing.Save(Listing, listing);

        item.MarkAsListed(listing.Quantity, ItemStatus.Unlisted);

        await item.Save(Item, item);

        res.redirect(`/listings/view/${Id}`);
    }
}