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

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/list/:type/:id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            let type = req.params.type;
            let Id = req.params.id;

            const storages = await Storage.FetchAll(Storage, [
                "Items",
                "Children"
            ]);

            let storage: Storage;

            if (type != 'building' && Id) {
                storage = await Storage.FetchOneById(Storage, Id, [
                    "Parent"
                ]);
            }

            let visible: Storage[];

            switch(type) {
                case 'bin':
                    visible = storages.filter(x => x.StorageType == StorageType.Bin);
                    break;
                case 'unit':
                    visible = storages.filter(x => x.StorageType == StorageType.Unit);
                    break;
                case 'building':
                    visible = storages.filter(x => x.StorageType == StorageType.Building);
                    break;
                default:
                    next(createHttpError(404));
                    return;
            }

            res.locals.viewData.storages = visible;
            res.locals.viewData.storage = storage;

            res.render(`storage/list/${type}`, res.locals.viewData);
        });
    }
}