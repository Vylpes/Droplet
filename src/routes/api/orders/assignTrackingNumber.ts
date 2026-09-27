import { NextFunction, Request, Response } from "express";
import { TrackingNumberType } from "../../../constants/TrackingNumberType";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { TrackingNumber } from "../../../database/entities/TrackingNumber";
import { Order } from "../../../database/entities/Order";
import { mapOrder } from "../../../dto";

export default class AssignTrackingNumber implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("number")
                .NotEmpty()
            .ChangeField("service")
                .NotEmpty()
                .Number();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const number = req.body.number;
        const service = req.body.service;

        const trackingNumber = new TrackingNumber(number, service, TrackingNumberType.Order);

        await trackingNumber.Save(TrackingNumber, trackingNumber);

        const order = await Order.FetchOneById(Order, Id, {
            TrackingNumbers: true
        });

        order.AddTrackingNumberToOrder(trackingNumber);

        await order.Save(Order, order);

        res.json(GenerateResponse(true, "Tracking number assigned", mapOrder(order, true)));
    }
}
