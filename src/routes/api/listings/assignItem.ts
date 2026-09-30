import { NextFunction, Request, Response } from "express";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Item } from "../../../database/entities/Item";
import { Listing } from "../../../database/entities/Listing";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapListing } from "../../../dto";

export default class AssignItem implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("itemId")
                .NotEmpty();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
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

        res.json(GenerateResponse(true, "Item assigned", mapListing(listing, true)));
    }
}
