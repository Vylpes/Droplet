import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../../constants/NoteType";
import { ListingStatus } from "../../../constants/Status/ListingStatus";
import { SupplyStatus } from "../../../constants/Status/SupplyStatus";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Listing } from "../../../database/entities/Listing";
import Note from "../../../database/entities/Note";
import { Order } from "../../../database/entities/Order";
import PostagePolicy from "../../../database/entities/PostagePolicy";
import { Supply } from "../../../database/entities/Supply";
import { mapListing, mapNote, mapOrder, mapPostagePolicy, mapSupply } from "../../../dto";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const Id = (req.params.Id as string);

        if (!Id) {
            next(createHttpError(404));
            return;
        }

        const order = await Order.FetchOneById(Order, Id, {
            Listings: true,
            Supplies: true,
            TrackingNumbers: true,
            PostagePolicy: true
        });

        const listings = await Listing.FetchAll(Listing);
        const supplies = await Supply.FetchAll(Supply);
        const postagePolicies = await PostagePolicy.FetchAll(PostagePolicy);

        if (!order) {
            next(createHttpError(404));
            return;
        }

        const notes = await Note.FetchAllForId(NoteType.Order, Id);

        res.json(GenerateResponse(true, undefined, {
            Order: mapOrder(order, true),
            Listings: listings.filter(x => x.Status == ListingStatus.Active).map(l => mapListing(l)),
            Supplies: supplies.filter(x => x.Status == SupplyStatus.Unused).map(mapSupply),
            PostagePolicies: postagePolicies.filter(x => !x.Archived).map(mapPostagePolicy),
            Notes: notes.map(mapNote)
        }));
    }
}
