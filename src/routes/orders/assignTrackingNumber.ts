import { NextFunction, Request, Response, Router } from "express";
import { TrackingNumberType } from "../../constants/TrackingNumberType";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { TrackingNumber } from "../../database/entities/TrackingNumber";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Order from "../../contracts/entities/Order/Order";
import { v4 } from "uuid";

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

            await ConnectionHelper.UpdateOne<Order>("order", { uuid: Id }, { $push: { trackingNumbers: { uuid: v4(), number, service } } });

            res.redirect(`/orders/view/${Id}`);
        });
    }
}