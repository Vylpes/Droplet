import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { Order } from "../../database/entities/Order";
import PostagePolicy from "../../database/entities/PostagePolicy";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("orderNumber")
                .NotEmpty()
            .ChangeField("offerAccepted")
                .NotEmpty()
                .Boolean()
            .ChangeField("buyer")
                .NotEmpty();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/orders/view/${Id}`);
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

        res.redirect(`/orders/view/${Id}`);
    }
}