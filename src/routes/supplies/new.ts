import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Supply } from "../../entity/Supply";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
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
            
            const supply = new Supply(name, sku, quantity);

            await supply.Save(Supply, supply);

            const purchase = await SupplyPurchase.FetchOneById(SupplyPurchase, purchaseId, [
                "Supplies"
            ]);

            purchase.AddSupplyToOrder(supply);

            await purchase.Save(SupplyPurchase, purchase);
            await purchase.CalculateItemPrices();

            res.redirect(`/supply-purchases/view/${purchaseId}`);
        });
    }
}