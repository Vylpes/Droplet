import { Request, Response, Router } from "express";
import { PurchaseStatus } from "../../constants/PurchaseStatus";
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
            const description = req.body.description;
            const price = req.body.price;
            
            const purchase = new Purchase(description, price);

            await purchase.Save(Purchase, purchase);

            res.redirect('/purchases');
        });
    }
}