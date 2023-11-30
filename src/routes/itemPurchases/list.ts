import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemPurchaseStatus } from "../../constants/Status/ItemPurchaseStatus";
import { Page } from "../../contracts/Page"
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const status = req.params.status;

            let visible: ItemPurchaseStatus;

            switch(status) {
                case 'ordered':
                    visible = ItemPurchaseStatus.Ordered;
                    break;
                case 'received':
                    visible = ItemPurchaseStatus.Received;
                    break;
                case 'inventoried':
                    visible = ItemPurchaseStatus.Inventoried;
                    break;
                case 'completed':
                    visible = ItemPurchaseStatus.Complete;
                    break;
                case 'rejected':
                    visible = ItemPurchaseStatus.Rejected;
                    break;
                default:
                    next(createHttpError(404));
                    return;
            }

            const purchaseMaybe = await ConnectionHelper.FindMultiple<ItemPurchase>("item-purchase", { status: visible });

            if (!purchaseMaybe.IsSuccess) {
                next(createHttpError(500));
                return;
            }

            const purchases = purchaseMaybe.Value!;

            res.locals.purchases = purchases;

            res.render(`item-purchases/list/${status}`, res.locals.viewData);
        });
    }
}