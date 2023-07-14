import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Order } from "../../entity/Order";
import PostagePolicy from "../../entity/PostagePolicy";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("orderNumber")
                .NotEmpty()
            .ChangeField("offerAccepted")
                .NotEmpty()
                .Boolean()
            .ChangeField("buyer")
                .NotEmpty();

        super.router.post('/view/:Id/update', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
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
        });
    }
}