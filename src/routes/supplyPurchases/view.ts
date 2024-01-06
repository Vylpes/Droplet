import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import Note from "../../database/entities/Note";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import GetOneSupplyPurchaseById from "../../domain/queries/SupplyPurchase/GetOneSupplyPurchaseById";
import { SupplyPurchaseStatusNames } from "../../constants/Status/SupplyPurchaseStatus";
import Supply from "../../domain/models/Supply/Supply";
import { SupplyStatusNames } from "../../constants/Status/SupplyStatus";
import GetAllSuppliesByPurchaseId from "../../domain/queries/Supply/GetAllSuppliesByPurchaseId";
import { RoundTo } from "../../helpers/NumberHelper";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/view/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
                return;
            }

            const purchase = await GetOneSupplyPurchaseById(Id);

            if (!purchase) {
                next(createHttpError(404));
                return;
            }

            const supplies = await GetAllSuppliesByPurchaseId(Id);

            res.locals.purchase = purchase;
            res.locals.notes = purchase.notes.sort((a, b) => a.whenCreated < b.whenCreated ? -1 : a.whenCreated > b.whenCreated ? 1 : 0);
            res.locals.statusName = SupplyPurchaseStatusNames.get(purchase.status);
            res.locals.supplies = supplies;
            res.locals.getSupplyStatusName = (supply: Supply) => SupplyStatusNames.get(supply.status);
            res.locals.calculateSupplyPrice = (supply: Supply) => RoundTo(RoundTo(purchase.price / supplies.length,2) / (supply.quantities.unused + supply.quantities.used), 2);

            res.render('supply-purchases/view', res.locals.viewData);
        });
    }
}