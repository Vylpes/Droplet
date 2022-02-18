import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { TrackingNumberType } from "../../constants/TrackingNumberType";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { Supply } from "../../entity/Supply";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { TrackingNumber } from "../../entity/TrackingNumber";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AssignTrackingNumber extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/assign-tracking-number', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const number = req.body.number;
            const service = req.body.service;

            const trackingNumber = new TrackingNumber(number, service, TrackingNumberType.Order);

            await trackingNumber.Save(TrackingNumber, trackingNumber);

            const order = await Order.FetchOneById(Order, Id, [
                "TrackingNumbers"
            ]);

            order.AddTrackingNumberToOrder(trackingNumber);

            await order.Save(Order, order);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}