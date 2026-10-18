import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../../constants/NoteType";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Item } from "../../../database/entities/Item";
import { Listing } from "../../../database/entities/Listing";
import Note from "../../../database/entities/Note";
import PostagePolicy from "../../../database/entities/PostagePolicy";
import { mapItem, mapListing, mapNote, mapPostagePolicy } from "../../../dto";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const Id = (req.params.Id as string);

        if (!Id) {
            next(createHttpError(404));
            return;
        }

        const listing = await Listing.FetchOneById(Listing, Id, {
            Items: true,
            PostagePolicy: true
        });

        const items = await Item.FetchAll(Item);

        const postagePolicies = await PostagePolicy.FetchAll(PostagePolicy);

        if (!listing) {
            next(createHttpError(404));
            return;
        }

        const notes = await Note.FetchAllForId(NoteType.Listing, Id);

        res.json(GenerateResponse(true, undefined, {
            Listing: mapListing(listing, true),
            Items: items.filter(x => x.Status == ItemStatus.Unlisted).map(item => mapItem(item)),
            PostagePolicies: postagePolicies.filter(x => !x.Archived).map(mapPostagePolicy),
            Notes: notes.map(mapNote)
        }));
    }
}
