import { Request, Response, Router } from "express";
import { ItemPurchaseStatus } from "../../constants/Status/ItemPurchaseStatus";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { Return } from "../../entity/Return";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
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