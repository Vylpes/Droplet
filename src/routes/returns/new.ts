import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { TrackingNumberType } from "../../constants/TrackingNumberType";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Order } from "../../entity/Order";
import { Return } from "../../entity/Return";
import { TrackingNumber } from "../../entity/TrackingNumber";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/new', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const returnNumber = req.body.returnNumber;
            const orderId = req.body.orderId;
            const trackingNum = req.body.trackingNumber;
            const trackingService = req.body.trackingService;
            const rma = await Return.GenerateRMA();
            
            let ret = new Return(returnNumber, rma);

            await ret.Save(Return, ret);

            ret = await Return.FetchOneById(Return, ret.Id, [
                "Order",
                "TrackingNumbers"
            ])

            const order = await Order.FetchOneById(Order, orderId);

            ret.AssignOrderToReturn(order);

            const trackingNumber = new TrackingNumber(trackingNum, trackingService, TrackingNumberType.Return);

            await trackingNumber.Save(TrackingNumber, trackingNumber);

            ret.AssignTrackingNumber(trackingNumber);

            await ret.Save(Return, ret);

            res.redirect(`/returns/opened`);
        });
    }
}