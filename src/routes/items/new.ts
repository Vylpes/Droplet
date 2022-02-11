import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { Purchase } from "../../entity/Purchase";
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

            const purchase = await Purchase.FetchOneById(Purchase, purchaseId, [
                "Items"
            ]);

            purchase.AddItemToOrder(item);

            await purchase.Save(Purchase, purchase);
            await purchase.CalculateItemPrices();

            res.redirect(`/purchases/${purchaseId}`);
        });
    }
}