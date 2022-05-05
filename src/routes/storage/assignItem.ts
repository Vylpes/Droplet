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
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AssignItem extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("itemId")
                .NotEmpty();

        super.router.post('/view/:Id/assign-item', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.id) {
                res.redirect(`/storage/view/${Id}`);
                return;
            }

            const itemId = req.body.itemId;

            const storage = await Storage.FetchOneById(Storage, Id, [
                "Items"
            ]);

            let item = await Item.FetchOneById(Item, itemId, [
                "Storage"
            ]);

            storage.AddItemToBin(item);

            await storage.Save(Storage, storage);

            item = await Item.FetchOneById(Item, itemId, [
                "Storage",
                "Storage.Parent",
                "Storage.Parent.Parent"
            ]);

            item.GenerateSku();

            await item.Save(Item, item);

            res.redirect(`/storage/view/${Id}`);
        });
    }
}