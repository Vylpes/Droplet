import { Request, Response, Router } from "express";
import { TrackingNumberType } from "../../constants/TrackingNumberType";
import { Page } from "../../contracts/Page";
import { Order } from "../../database/entities/Order";
import { Return } from "../../database/entities/Return";
import { TrackingNumber } from "../../database/entities/TrackingNumber";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("returnNumber", "/returns/opened")
                .NotEmpty()
            .ChangeField("orderId")
                .NotEmpty()
            .ChangeField("trackingNumber")
                .NotEmpty()
            .ChangeField("trackingService")
                .NotEmpty()
                .Number();

        super.router.post('/new', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
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