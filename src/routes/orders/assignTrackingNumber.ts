import { NextFunction, Request, Response, Router } from "express";
import { TrackingNumberType } from "../../constants/TrackingNumberType";
import Page from "../../contracts/Page";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { TrackingNumber } from "../../database/entities/TrackingNumber";
import { Order } from "../../database/entities/Order";

export default class AssignTrackingNumber implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("number")
                .NotEmpty()
            .ChangeField("service")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/orders/view/${Id}`);
            return;
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
    }
}