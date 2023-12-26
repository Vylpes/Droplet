import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import Note from "../../database/entities/Note";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import { RoundTo } from "../../helpers/NumberHelper";
import GetOneItemById from "../../domain/queries/Item/GetOneItemById";
import GetOneStorageByBinId from "../../domain/queries/Storage/GetOneStorageByBinId";
import GetOneItemPurchaseById from "../../domain/queries/ItemPurchase/GetOneItemPurchaseById";

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

            const item = await GetOneItemById(itemId);

            const storageBuilding = await GetOneStorageByBinId(item.r_storageBin);
            const storageUnit = storageBuilding.units[0];
            const storageBin = storageUnit.bins[0];

            const notes = item.notes.sort((a, b) => a.whenCreated < b.whenCreated ? -1 : a.whenCreated > b.whenCreated ? 1 : 0);

            const itemPurchase = await GetOneItemPurchaseById(item.r_itemPurchase);

            res.locals.item = item;
            res.locals.notes = notes;
            res.locals.buyPrice = RoundTo(RoundTo(itemPurchase.price / itemPurchase.r_items.length,2) / (item.quantities.listed + item.quantities.unlisted + item.quantities.sold + item.quantities.rejected), 2);
            res.locals.storageBuilding = storageBuilding;
            res.locals.storageUnit = storageUnit;
            res.locals.storageBin = storageBin;

            res.render('items/view', res.locals.viewData);
        });
    }
}