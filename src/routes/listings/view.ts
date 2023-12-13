import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { ItemStatus, ItemStatusNames } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import Note from "../../database/entities/Note";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Listing from "../../contracts/entities/Listing/Listing";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";
import PostagePolicy from "../../contracts/entities/PostagePolicy/PostagePolicy";
import { ListingStatusNames } from "../../constants/Status/ListingStatus";
import Item from "../../contracts/entities/ItemPurchase/Item";

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

            const listingMaybe = await ConnectionHelper.FindOne<Listing>("listing", { uuid: Id });

            if (!listingMaybe.IsSuccess) {
                next(createHttpError(404));
                return;
            }

            const listing = listingMaybe.Value;

            const itemPurchasesMaybe = await ConnectionHelper.FindMultiple<ItemPurchase>("item-purchase", {});
            const allItemPurchases = itemPurchasesMaybe.Value!;

            const assignedItems = allItemPurchases
                .flatMap(x => x.items)
                .filter(x => listing.r_items.includes(x.uuid));

            const items = allItemPurchases
                .flatMap(x => x.items)
                .filter(x => x.status == ItemStatus.Unlisted);

            const postagePoliciesMaybe = await ConnectionHelper.FindMultiple<PostagePolicy>("postage-policy", { archived: false });
            const postagePolicies = postagePoliciesMaybe.Value!;

            res.locals.listing = listing;
            res.locals.items = items;
            res.locals.assignedItems = assignedItems;
            res.locals.postagePolicies = postagePolicies;
            res.locals.statusName = ListingStatusNames.get(listing.status);
            res.locals.itemStatusName = (item: Item) => ItemStatusNames.get(item.status);

            res.render('listings/view', res.locals.viewData);
        });
    }
}