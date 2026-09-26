import { NextFunction, Request, Response } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import Page from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { Listing } from "../../database/entities/Listing";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class AssignItem implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new BodyValidator("itemId")
                .NotEmpty();

        const Id = (req.params.Id as string);

        if (!await bodyValidation.Validate(req)) {
            res.redirect(`/listings/view/${Id}`);
            return;
        }

        const itemId = req.body.itemId;

        const item = await Item.FetchOneById(Item, itemId);

        const listing = await Listing.FetchOneById(Listing, Id, {
            Items: true
        });

        listing.AddItemToListing(item);

        await listing.Save(Listing, listing);

        item.MarkAsListed(listing.Quantity, ItemStatus.Unlisted);

        await item.Save(Item, item);

        res.redirect(`/listings/view/${Id}`);
    }
}