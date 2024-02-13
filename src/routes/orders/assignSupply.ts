import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import { Supply } from "../../database/entities/Supply";
import { Order } from "../../database/entities/Order";

export default class AssignSupply implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("supplyId")
                .NotEmpty()
            .ChangeField("amount")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/orders/view/${Id}`);
            return;
        }

        const supplyId = req.body.supplyId;
        const amount = req.body.amount;

        const supply = await Supply.FetchOneById(Supply, supplyId);

        const order = await Order.FetchOneById(Order, Id, [
            "Supplies"
        ]);

        order.AddSupplyToOrder(supply);

        await order.Save(Order, order);

        supply.RemoveStock(amount);

        await supply.Save(Supply, supply);

        res.redirect(`/orders/view/${Id}`);
    }
}