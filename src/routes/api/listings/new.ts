import { Request, Response } from "express";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Item } from "../../../database/entities/Item";
import { Listing } from "../../../database/entities/Listing";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapListing } from "../../../dto";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("name")
                .NotEmpty()
            .ChangeField("listingNumber")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number()
            .ChangeField("endDate")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number()
            .ChangeField("itemId")
                .NotEmpty();

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const name = req.body.name;
        const listingNumber = req.body.listingNumber;
        const price = req.body.price;
        const endDate = req.body.endDate;
        const quantity = req.body.quantity;
        const itemId = req.body.itemId;

        const item = await Item.FetchOneById(Item, itemId);

        let listing = new Listing(name, listingNumber, price, endDate, quantity);

        await listing.Save(Listing, listing);

        listing = await Listing.FetchOneById(Listing, listing.Id, {
            Items: true
        });

        listing.AddItemToListing(item);

        await listing.Save(Listing, listing);

        item.MarkAsListed(quantity, ItemStatus.Unlisted);

        await item.Save(Item, item);

        res.json(GenerateResponse(true, "Listing created", mapListing(listing, true)));
    }
}
