import { Request, Response } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import Page from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { Listing } from "../../database/entities/Listing";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("name")
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

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect('/listings/active');
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

        listing = await Listing.FetchOneById(Listing, listing.Id, [
            "Items"
        ]);;

        listing.AddItemToListing(item);

        await listing.Save(Listing, listing);

        item.MarkAsListed(quantity, ItemStatus.Unlisted);

        await item.Save(Item, item);

        res.redirect('/listings/active');
    }
}