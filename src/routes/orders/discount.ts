import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { Order } from "../../database/entities/Order";

export default class Discount extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("amount")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/discount', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/orders/view/${Id}`);
                return;
            }

            const amount = req.body.amount;

            const order = await Order.FetchOneById(Order, Id);

            order.ApplyDiscount(amount);

            await order.Save(Order, order);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}