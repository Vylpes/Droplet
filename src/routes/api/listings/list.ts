import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import { ListingStatus } from "../../../constants/Status/ListingStatus";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Item } from "../../../database/entities/Item";
import { Listing } from "../../../database/entities/Listing";
import { mapItem, mapListing } from "../../../dto";

export default class List implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const status = (req.params.status as string);

        const listings = await Listing.FetchAll(Listing, {
            Items: true
        });

        const items = await Item.FetchAll(Item);

        let listingsVisible: Listing[];

        switch(status) {
            case 'active':
                listingsVisible = listings.filter(x => x.Status == ListingStatus.Active);
                break;
            case 'sold':
                listingsVisible = listings.filter(x => x.Status == ListingStatus.Sold);
                break;
            case 'unsold':
                listingsVisible = listings.filter(x => x.Status == ListingStatus.Unsold);
                break;
            case 'expired':
                listingsVisible = listings.filter(x => x.Status == ListingStatus.Active && x.EndDate < new Date());
                break;
            default:
                next(createHttpError(404));
                return;
        }

        res.json(GenerateResponse(true, undefined, {
            Listings: listingsVisible.map(l => mapListing(l, true)),
            Items: items.filter(x => x.Status == ItemStatus.Unlisted).map(mapItem)
        }));
    }
}
