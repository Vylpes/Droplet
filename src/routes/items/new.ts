import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
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
            const buyPrice = req.body.buyPrice;
            const sellPrice = req.body.sellPrice;
            
            const item = new Item(name, sku, quantity, buyPrice, sellPrice);

            await item.Save(Item, item);

            res.redirect('/items');
        });
    }
}