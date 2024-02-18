import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import { Order } from "../../database/entities/Order";

export default class Discount implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("amount")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/orders/view/${Id}`);
            return;
        }

        const amount = req.body.amount;

        const order = await Order.FetchOneById(Order, Id);

        order.ApplyDiscount(amount);

        await order.Save(Order, order);

        res.redirect(`/orders/view/${Id}`);
    }
}