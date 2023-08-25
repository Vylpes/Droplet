import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import { ItemPurchase } from "../../database/entities/ItemPurchase";
import Note from "../../database/entities/Note";
import { UserMiddleware } from "../../middleware/userMiddleware";

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

            const purchase = await ItemPurchase.FetchOneById(ItemPurchase, Id, [
                "Items"
            ]);

            if (!purchase) {
                next(createHttpError(404));
            }

            const notes = await Note.FetchAllForId(NoteType.ItemPurchase, Id);

            res.locals.purchase = purchase;
            res.locals.notes = notes.sort((a, b) => a.WhenCreated < b.WhenCreated ? -1 : a.WhenCreated > b.WhenCreated ? 1 : 0);

            res.render('item-purchases/view', res.locals.viewData);
        });
    }
}