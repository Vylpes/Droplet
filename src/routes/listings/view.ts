import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { ItemStatus, ItemStatusNames } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import Note from "../../database/entities/Note";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import { ListingStatusNames } from "../../constants/Status/ListingStatus";
import GetOneListingById from "../../domain/queries/Listing/GetOneListingById";
import GetAllItemsAssignedByListingId from "../../domain/queries/Item/GetAllItemsAssignedByListingId";
import GetAllItemsByStatus from "../../domain/queries/Item/GetAllItemsByStatus";
import GetAllPostagePoliciesNotArchived from "../../domain/queries/PostagePolicy/GetAllPostagePoliciesNotArchived";
import Item from "../../domain/models/Item/Item";

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

            const listing = await GetOneListingById(Id);
            const assignedItems = await GetAllItemsAssignedByListingId(Id);
            const unlistedItems = await GetAllItemsByStatus(ItemStatus.Unlisted);
            const postagePolicies = await GetAllPostagePoliciesNotArchived();

            res.locals.listing = listing;
            res.locals.items = unlistedItems;
            res.locals.assignedItems = assignedItems;
            res.locals.postagePolicies = postagePolicies;
            res.locals.statusName = ListingStatusNames.get(listing.status);
            res.locals.getItemStatusName = (item: Item) => ItemStatusNames.get(item.status);

            res.render('listings/view', res.locals.viewData);
        });
    }
}