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
import GetOneOrderById from "../../domain/queries/Order/GetOneOrderById";
import GetAllListingsByStatus from "../../domain/queries/Listing/GetAllListingsByStatus";
import GetAllSuppliesByStatus from "../../domain/queries/Supply/GetAllSuppliesByStatus";
import GetAllPostagePoliciesNotArchived from "../../domain/queries/PostagePolicy/GetAllPostagePoliciesNotArchived";

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

            const order = await GetOneOrderById(Id);

            const listings = await GetAllListingsByStatus(ListingStatus.Active);
            const supplies = await GetAllSuppliesByStatus(SupplyStatus.Unused);
            const postagePolicies = await GetAllPostagePoliciesNotArchived();

            if (!order) {
                next(createHttpError(404));
            }

            const notes = await Note.FetchAllForId(NoteType.Order, Id);

            res.locals.order = order;
            res.locals.listings = listings;
            res.locals.supplies = supplies;
            res.locals.postagePolicies = postagePolicies;
            res.locals.notes = notes;

            res.render('orders/view', res.locals.viewData);
        });
    }
}