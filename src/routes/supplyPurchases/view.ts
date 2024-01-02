import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import Note from "../../database/entities/Note";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import GetOneSupplyPurchaseById from "../../domain/queries/SupplyPurchase/GetOneSupplyPurchaseById";

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

            const purchase = await GetOneSupplyPurchaseById(Id);

            res.locals.purchase = purchase;
            res.locals.notes = purchase.notes.sort((a, b) => a.whenCreated < b.whenCreated ? -1 : a.whenCreated > b.whenCreated ? 1 : 0);

            res.render('supply-purchases/view', res.locals.viewData);
        });
    }
}