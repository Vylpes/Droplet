import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { ListingStatus } from "../../constants/Status/ListingStatus";
import { OrderStatus } from "../../constants/Status/OrderStatus";
import { StorageType } from "../../constants/StorageType";
import { Page } from "../../contracts/Page"
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { Storage } from "../../entity/Storage";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class View extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/view/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            let id = req.params.Id;

            const bin = await Storage.FetchOneById(Storage, id, [
                "Items",
                "Items.Storage",
                "Parent"
            ]);

            const items = await Item.FetchAll(Item, [
                "Storage"
            ]);

            const storages = await Storage.FetchAll(Storage, [
                "Items"
            ]);

            res.locals.viewData.storage = bin;
            res.locals.viewData.items = items.filter(x => x.Storage == null);
            res.locals.viewData.storages = storages.filter(x => x.StorageType == StorageType.Bin);

            res.render(`storage/view`, res.locals.viewData);
        });
    }
}