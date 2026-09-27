import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { Supply } from "../../../database/entities/Supply";
import { Order } from "../../../database/entities/Order";
import { mapOrder } from "../../../dto";

export default class AssignSupply implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("supplyId")
                .NotEmpty()
            .ChangeField("amount")
                .NotEmpty()
                .Number();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const supplyId = req.body.supplyId;
        const amount = req.body.amount;

        const supply = await Supply.FetchOneById(Supply, supplyId);

        const order = await Order.FetchOneById(Order, Id, {
            Supplies: true
        });

        order.AddSupplyToOrder(supply);

        await order.Save(Order, order);

        supply.RemoveStock(amount);

        await supply.Save(Supply, supply);

        res.json(GenerateResponse(true, "Supply assigned", mapOrder(order, true)));
    }
}
