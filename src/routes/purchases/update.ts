import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { Purchase } from "../../entity/Purchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/:Id/update', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const description = req.body.description;
            const price = req.body.price;

            const purchase = await Purchase.FetchOneById(Purchase, Id, [
                "Items"
            ]);

            purchase.UpdateBasicDetails(description, price);

            await purchase.Save(Purchase, purchase);
            await purchase.CalculateItemPrices();

            res.redirect(`/purchases/${Id}`);
        });
    }
}