import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Order } from "../../../database/entities/Order";
import PostagePolicy from "../../../database/entities/PostagePolicy";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapOrder } from "../../../dto";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("orderNumber")
                .NotEmpty()
            .ChangeField("offerAccepted")
                .NotEmpty()
                .Boolean()
            .ChangeField("buyer")
                .NotEmpty();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const orderNumber = req.body.orderNumber;
        const offerAccepted = req.body.offerAccepted == "true";
        const buyer = req.body.buyer;
        const postagePolicyId = req.body.postagePolicyId;

        const order = await Order.FetchOneById(Order, Id);

        order.UpdateBasicDetails(orderNumber, offerAccepted, buyer);

        await order.Save(Order, order);

        if (postagePolicyId) {
            const postagePolicy = await PostagePolicy.FetchOneById(PostagePolicy, postagePolicyId);

            order.AddPostagePolicyToOrder(postagePolicy);

            await order.Save(Order, order);
        } else {
            order.RemovePostagePolicy();

            await order.Save(Order, order);
        }

        res.json(GenerateResponse(true, "Order updated", mapOrder(order)));
    }
}
