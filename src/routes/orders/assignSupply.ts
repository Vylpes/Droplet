import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Order } from "../../entity/Order";
import { Supply } from "../../entity/Supply";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

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
                "Supplies"
            ]);

            order.AddSupplyToOrder(supply);

            await order.Save(Order, order);

            supply.RemoveStock(amount);

            await supply.Save(Supply, supply);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}