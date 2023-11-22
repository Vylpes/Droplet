import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { Supply } from "../../database/entities/Supply";
import { Order } from "../../database/entities/Order";
import { OrderSupply } from "../../database/entities/OrderSupply";

export default class AssignSupply extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("supplyId")
                .NotEmpty()
            .ChangeField("amount")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/assign-supply', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/orders/view/${Id}`);
                return;
            }

            const supplyId = req.body.supplyId;
            const amount = req.body.amount;

            const supply = await Supply.FetchOneById(Supply, supplyId);

            const order = await Order.FetchOneById(Order, Id, [
                "Supplies",
            ]);

            await order.Save(Order, order);

            const orderSupply = new OrderSupply(amount);
            await orderSupply.Save(OrderSupply, orderSupply);

            orderSupply.AssignOrder(order);
            orderSupply.AssignSupply(supply);

            await orderSupply.Save(OrderSupply, orderSupply);

            supply.RemoveStock(amount);

            await supply.Save(Supply, supply);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}