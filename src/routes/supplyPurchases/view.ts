import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import Page from "../../contracts/Page";
import Note from "../../database/entities/Note";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const Id = req.params.Id;

        if (!Id) {
            next(createHttpError(404));
        }

        const purchase = await SupplyPurchase.FetchOneById(SupplyPurchase, Id, [
            "Supplies"
        ]);

        if (!purchase) {
            next(createHttpError(404));
        }

        const notes = await Note.FetchAllForId(NoteType.SupplyPurchase, Id);

        res.locals.purchase = purchase;
        res.locals.notes = notes.sort((a, b) => a.WhenCreated < b.WhenCreated ? -1 : a.WhenCreated > b.WhenCreated ? 1 : 0);

        res.render('supply-purchases/view', res.locals.viewData);
    }
}