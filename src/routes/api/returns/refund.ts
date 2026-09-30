import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Order } from "../../../database/entities/Order";
import { Return } from "../../../database/entities/Return";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapReturn } from "../../../dto";

export default class Refund implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("refundAmount")
                .NotEmpty()
                .Number();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const refundAmount = req.body.refundAmount;

        const ret = await Return.FetchOneById(Return, Id, {
            Order: true
        });

        ret.MarkAsRefunded(refundAmount);

        await ret.Save(Return, ret);

        const order = await Order.FetchOneById(Order, ret.Order.Id);

        order.MarkAsReturned();

        await order.Save(Order, order);

        res.json(GenerateResponse(true, "Return refunded", mapReturn(ret, true)));
    }
}
