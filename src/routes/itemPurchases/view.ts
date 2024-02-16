import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import Page from "../../contracts/Page";
import { ItemPurchase } from "../../database/entities/ItemPurchase";
import Note from "../../database/entities/Note";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const Id = req.params.Id;

        if (!Id) {
            next(createHttpError(404));
            return;
        }

        const purchase = await ItemPurchase.FetchOneById(ItemPurchase, Id, [
            "Items"
        ]);

        if (!purchase) {
            next(createHttpError(404));
            return;
        }

        const notes = await Note.FetchAllForId(NoteType.ItemPurchase, Id);

        res.locals.purchase = purchase;
        res.locals.notes = notes.sort((a, b) => a.WhenCreated < b.WhenCreated ? -1 : a.WhenCreated > b.WhenCreated ? 1 : 0);

        res.render('item-purchases/view', res.locals.viewData);
    }
}