import { Request, Response, Router } from "express";
import Page from "../../contracts/Page";
import { Order } from "../../database/entities/Order";
import { Return } from "../../database/entities/Return";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Refund implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("refundAmount")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/returns/view/${Id}`);
            return;
        }

        const refundAmount = req.body.refundAmount;

        const ret = await Return.FetchOneById(Return, Id, [
            "Order"
        ]);

        ret.MarkAsRefunded(refundAmount);

        await ret.Save(Return, ret);

        const order = await Order.FetchOneById(Order, ret.Order.Id);

        order.MarkAsReturned();

        await order.Save(Order, order);

        res.redirect(`/returns/view/${Id}`);
    }
}