import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { TrackingNumberType } from "../../constants/TrackingNumberType";
import { Page } from "../../contracts/Page";
import { Order } from "../../entity/Order";
import { TrackingNumber } from "../../entity/TrackingNumber";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AssignTrackingNumber extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("number")
                .NotEmpty()
            .ChangeField("service")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/assign-tracking-number', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
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
        });
    }
}