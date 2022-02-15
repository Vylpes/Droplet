import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/new', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const name = req.body.name;
            const sku = req.body.sku;
            const quantity = req.body.quantity;
            const purchaseId = req.body.purchaseId;
            
            const item = new Item(name, sku, quantity);

            await item.Save(Item, item);

            let purchase = await ItemPurchase.FetchOneById(ItemPurchase, purchaseId, [
                "Items"
            ]);

            purchase.AddItemToOrder(item);

            await purchase.Save(ItemPurchase, purchase);

            purchase = await ItemPurchase.FetchOneById(ItemPurchase, purchaseId, [
                "Items"
            ]);

            await purchase.CalculateItemPrices();

            res.redirect(`/item-purchases/view/${purchaseId}`);
        });
    }
}