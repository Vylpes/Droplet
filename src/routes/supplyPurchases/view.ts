import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import Note from "../../entity/Note";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
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
        });
    }
}