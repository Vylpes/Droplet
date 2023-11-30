import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import Note from "../../database/entities/Note";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";
import { RoundTo } from "../../helpers/NumberHelper";
import Storage from "../../contracts/entities/Storage/Storage";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:itemId', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const itemId = req.params.itemId;

            if (!itemId) {
                next(createHttpError(404));
                return;
            }

            const itemPurchaseMaybe = await ConnectionHelper.FindOne<ItemPurchase>('item-purchase', { items: { uuid: itemId } });


            if (!itemPurchaseMaybe.IsSuccess) {
                next(createHttpError(404));
                return;
            }

            const itemPurchase = itemPurchaseMaybe.Value!;
            const item = itemPurchase.items.find(x => x.uuid == itemId);

            const storageBuildingMaybe = await ConnectionHelper.FindOne<Storage>('storage', { units: { bins: { uuid: item.r_storageBin } }});
            const storageBuilding = storageBuildingMaybe.IsSuccess ? storageBuildingMaybe.Value! : null;
            const storageUnit = storageBuildingMaybe.IsSuccess ? storageBuilding.units[0] : null;
            const storageBin = storageBuildingMaybe.IsSuccess ? storageUnit.bins[0] : null;

            const notes = item.notes.sort((a, b) => a.whenCreated < b.whenCreated ? -1 : a.whenCreated > b.whenCreated ? 1 : 0);

            res.locals.item = item;
            res.locals.notes = notes;
            res.locals.buyPrice = RoundTo(RoundTo(itemPurchase.price / itemPurchase.items.length,2) / (item.quantities.listed + item.quantities.unlisted + item.quantities.sold + item.quantities.rejected), 2);
            res.locals.storageBuilding = storageBuilding;
            res.locals.storageUnit = storageUnit;
            res.locals.storageBin = storageBin;

            res.render('items/view', res.locals.viewData);
        });
    }
}