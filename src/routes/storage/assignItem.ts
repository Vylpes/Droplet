import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { Storage } from "../../entity/Storage";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AssignItem extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/assign-item', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const itemId = req.body.itemId;

            const storage = await Storage.FetchOneById(Storage, Id, [
                "Items"
            ]);

            const item = await Item.FetchOneById(Item, itemId, [
                "Storage"
            ]);

            storage.AddItemToBin(item);

            await storage.Save(Storage, storage);

            res.redirect(`/storage/view/${Id}`);
        });
    }
}