import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { Order } from "../../../database/entities/Order";
import { mapOrder } from "../../../dto";

export default class Discount implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("amount")
                .NotEmpty()
                .Number();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const amount = req.body.amount;

        const order = await Order.FetchOneById(Order, Id);

        order.ApplyDiscount(amount);

        await order.Save(Order, order);

        res.json(GenerateResponse(true, "Discount applied", mapOrder(order)));
    }
}
