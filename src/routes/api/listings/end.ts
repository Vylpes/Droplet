import { Request, Response } from "express";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Item } from "../../../database/entities/Item";
import { Listing } from "../../../database/entities/Listing";
import { mapListing } from "../../../dto";

export default class End implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const Id = (req.params.Id as string);

        const listing = await Listing.FetchOneById(Listing, Id, {
            Items: true
        });

        listing.MarkAsUnsold();

        await listing.Save(Listing, listing);

        for (const item of listing.Items) {
            item.MarkAsUnlisted(listing.Quantity, ItemStatus.Listed);

            await item.Save(Item, item);
        }

        res.json(GenerateResponse(true, "Listing ended", mapListing(listing, true)));
    }
}
