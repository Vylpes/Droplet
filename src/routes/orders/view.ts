import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { ListingStatus } from "../../constants/Status/ListingStatus";
import { SupplyStatus } from "../../constants/Status/SupplyStatus";
import { Page } from "../../contracts/Page";
import { Listing } from "../../database/entities/Listing";
import Note from "../../database/entities/Note";
import { Order } from "../../database/entities/Order";
import PostagePolicy from "../../database/entities/PostagePolicy";
import { Supply } from "../../database/entities/Supply";
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

            const order = await Order.FetchOneById(Order, Id, [
                "Listings",
                "Listings.Listing",
                "Supplies",
                "TrackingNumbers",
                "PostagePolicy"
            ]);

            const listings = await Listing.FetchAll(Listing);
            const supplies = await Supply.FetchAll(Supply);
            const postagePolicies = await PostagePolicy.FetchAll(PostagePolicy);

            if (!order) {
                next(createHttpError(404));
            }

            const notes = await Note.FetchAllForId(NoteType.Order, Id);

            console.log(order.Listings.length);

            res.locals.order = order;
            res.locals.listings = listings.filter(x => x.Status == ListingStatus.Active);
            res.locals.supplies = supplies.filter(x => x.Status == SupplyStatus.Unused);
            res.locals.postagePolicies = postagePolicies.filter(x => !x.Archived);
            res.locals.notes = notes;

            res.render('orders/view', res.locals.viewData);
        });
    }
}