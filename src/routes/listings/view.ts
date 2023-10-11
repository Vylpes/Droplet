import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { Listing } from "../../database/entities/Listing";
import Note from "../../database/entities/Note";
import PostagePolicy from "../../database/entities/PostagePolicy";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/view/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }

            const listing = await Listing.FetchOneById(Listing, Id, [
                "Items",
                "Items.Item",
                "Items.Listing",
                "PostagePolicy"
            ]);

            const items = await Item.FetchAll(Item);

            const postagePolicies = await PostagePolicy.FetchAll(PostagePolicy);

            if (!listing) {
                next(createHttpError(404));
            }

            const notes = await Note.FetchAllForId(NoteType.Listing, Id);

            res.locals.listing = listing;
            res.locals.items = items.filter(x => x.Status == ItemStatus.Unlisted);
            res.locals.postagePolicies = postagePolicies.filter(x => !x.Archived);
            res.locals.notes = notes;

            res.render('listings/view', res.locals.viewData);
        });
    }
}