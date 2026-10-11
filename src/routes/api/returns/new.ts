import { Request, Response } from "express";
import { TrackingNumberType } from "../../../constants/TrackingNumberType";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import { Order } from "../../../database/entities/Order";
import { Return } from "../../../database/entities/Return";
import { TrackingNumber } from "../../../database/entities/TrackingNumber";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapReturn } from "../../../dto";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("returnNumber")
                .NotEmpty()
            .ChangeField("orderId")
                .NotEmpty()
            .ChangeField("trackingNumber")
                .NotEmpty()
            .ChangeField("trackingService")
                .NotEmpty()
                .Number();

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const returnNumber = req.body.returnNumber;
        const orderId = req.body.orderId;
        const trackingNum = req.body.trackingNumber;
        const trackingService = req.body.trackingService;
        const rma = await Return.GenerateRMA();

        let ret = new Return(returnNumber, rma);

        await ret.Save(Return, ret);

        ret = await Return.FetchOneById(Return, ret.Id, {
            Order: true,
            TrackingNumbers: true
        });

        const order = await Order.FetchOneById(Order, orderId);

        ret.AssignOrderToReturn(order);

        const trackingNumber = new TrackingNumber(trackingNum, trackingService, TrackingNumberType.Return);

        await trackingNumber.Save(TrackingNumber, trackingNumber);

        ret.AssignTrackingNumber(trackingNumber);

        await ret.Save(Return, ret);

        res.json(GenerateResponse(true, "Return created", mapReturn(ret, true)));
    }
}
