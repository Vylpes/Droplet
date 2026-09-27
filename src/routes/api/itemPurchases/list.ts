import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ItemPurchaseStatus } from "../../../constants/Status/ItemPurchaseStatus";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { ItemPurchase } from "../../../database/entities/ItemPurchase";
import { mapItemPurchase } from "../../../dto";

export default class List implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const status = (req.params.status as string);

        const purchases = await ItemPurchase.FetchAll(ItemPurchase, {
            Items: true
        });

        let visible: ItemPurchase[];

        switch(status) {
            case 'ordered':
                visible = purchases.filter(x => x.Status == ItemPurchaseStatus.Ordered);
                break;
            case 'received':
                visible = purchases.filter(x => x.Status == ItemPurchaseStatus.Received);
                break;
            case 'inventoried':
                visible = purchases.filter(x => x.Status == ItemPurchaseStatus.Inventoried);
                break;
            case 'completed':
                visible = purchases.filter(x => x.Status == ItemPurchaseStatus.Complete);
                break;
            case 'rejected':
                visible = purchases.filter(x => x.Status == ItemPurchaseStatus.Rejected);
                break;
            default:
                next(createHttpError(404));
                return;
        }

        res.json(GenerateResponse(true, undefined, visible.map(p => mapItemPurchase(p, true))));
    }
}
