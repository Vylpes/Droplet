import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Order } from "../../database/entities/Order";
import { Return } from "../../database/entities/Return";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Refund extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("refundAmount")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/refund', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const Id = req.params.Id;

            if (req.session.error) {
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
        });
    }
}