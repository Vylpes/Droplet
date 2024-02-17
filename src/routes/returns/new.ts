import { Request, Response } from "express";
import { TrackingNumberType } from "../../constants/TrackingNumberType";
import Page from "../../contracts/Page";
import { Order } from "../../database/entities/Order";
import { Return } from "../../database/entities/Return";
import { TrackingNumber } from "../../database/entities/TrackingNumber";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class New implements Page {
    public async OnGetAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("returnNumber")
                .NotEmpty()
            .ChangeField("orderId")
                .NotEmpty()
            .ChangeField("trackingNumber")
                .NotEmpty()
            .ChangeField("trackingService")
                .NotEmpty()
                .Number();

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect("/returns/opened");
            return;
        }

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
    }
}