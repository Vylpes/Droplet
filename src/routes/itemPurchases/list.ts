import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemPurchaseStatus } from "../../constants/ItemPurchaseStatus";
import { Page } from "../../contracts/Page"
import { ItemPurchase } from "../../entity/ItemPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const status = req.params.status;

            const purchases = await ItemPurchase.FetchAll(ItemPurchase, [
                "Items"
            ]);

            let visible: ItemPurchase[];

            switch(status) {
                case 'ordered':
                    visible = purchases.filter(x => x.Status == ItemPurchaseStatus.Ordered);
                    break;
                case 'received':
                    visible = purchases.filter(x => x.Status == ItemPurchaseStatus.Received);
                    break;
                case 'inventoried':
                    visible = purchases.filter(x => x.Status == ItemPurchaseStatus.Inventoried);
                    break;
                case 'completed':
                    visible = purchases.filter(x => x.Status == ItemPurchaseStatus.Complete);
                    break;
                case 'rejected':
                    visible = purchases.filter(x => x.Status == ItemPurchaseStatus.Rejected);
                    break;
                default:
                    next(createHttpError(404));
                    return;
            }

            res.locals.purchases = visible;

            res.render(`item-purchases/list/${status}`, res.locals.viewData);
        });
    }
}