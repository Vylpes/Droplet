import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Order } from "../../database/entities/Order";
import { Return } from "../../database/entities/Return";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import MarkReturnAsRefundedCommand from "../../domain/commands/Return/MarkReturnAsRefundedCommand";
import GetOneReturnById from "../../domain/queries/Return/GetOneReturnById";
import GetOneOrderById from "../../domain/queries/Order/GetOneOrderById";
import UpdateOrderStatusCommand from "../../domain/commands/Order/UpdateOrderStatusCommand";
import { OrderStatus } from "../../constants/Status/OrderStatus";

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

            await MarkReturnAsRefundedCommand(Id, refundAmount);

            const ret = await GetOneReturnById(Id);

            await UpdateOrderStatusCommand(ret.r_order, OrderStatus.Returned);

            res.redirect(`/returns/view/${Id}`);
        });
    }
}