import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { SupplyPurchaseStatus } from "../../constants/Status/SupplyPurchaseStatus";
import Page from "../../contracts/Page"
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";

export default class List implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const status = req.params.status;

        const purchases = await SupplyPurchase.FetchAll(SupplyPurchase, [
            "Supplies"
        ]);

        let visible: SupplyPurchase[];

        switch(status) {
            case 'ordered':
                visible = purchases.filter(x => x.Status == SupplyPurchaseStatus.Ordered);
                break;
            case 'received':
                visible = purchases.filter(x => x.Status == SupplyPurchaseStatus.Received);
                break;
            case 'inventoried':
                visible = purchases.filter(x => x.Status == SupplyPurchaseStatus.Inventoried);
                break;
            case 'completed':
                visible = purchases.filter(x => x.Status == SupplyPurchaseStatus.Complete);
                break;
            case 'rejected':
                visible = purchases.filter(x => x.Status == SupplyPurchaseStatus.Rejected);
                break;
            default:
                next(createHttpError(404));
                return;
        }

        res.locals.purchases = visible;

        res.render(`supply-purchases/list/${status}`, res.locals.viewData);
    }
}