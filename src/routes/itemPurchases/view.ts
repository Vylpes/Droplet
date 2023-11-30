import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";
import { ItemPurchaseStatusNames } from "../../constants/Status/ItemPurchaseStatus";
import { ItemStatusNames } from "../../constants/Status/ItemStatus";
import { RoundTo } from "../../helpers/NumberHelper";
import Item from "../../contracts/entities/ItemPurchase/Item";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/view/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }

            const purchaseMaybe = await ConnectionHelper.FindOne<ItemPurchase>("item-purchase", { uuid: Id });

            if (!purchaseMaybe.IsSuccess) {
                next(createHttpError(404));
                return;
            }

            const purchase = purchaseMaybe.Value!;
            const notes = purchase.notes.sort((a, b) => a.whenCreated < b.whenCreated ? -1 : a.whenCreated > b.whenCreated ? 1 : 0);

            res.locals.purchase = purchase;
            res.locals.notes = notes;
            res.locals.purchaseStatusName = ItemPurchaseStatusNames.get(purchase.status);
            res.locals.itemStatusName = (item: Item) => ItemStatusNames.get(item.status);
            res.locals.calculateTotalQuantity = (item: Item) => item.quantities.unlisted + item.quantities.listed + item.quantities.sold + item.quantities.rejected;
            res.locals.calculateItemPrice = (item: Item) => RoundTo(RoundTo(purchase.price / purchase.items.length,2) / (item.quantities.listed + item.quantities.unlisted + item.quantities.sold + item.quantities.rejected), 2);

            res.render('item-purchases/view', res.locals.viewData);
        });
    }
}