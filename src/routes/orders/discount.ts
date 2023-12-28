import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import DiscountOrderCommand from "../../domain/commands/Order/DiscountOrderCommand";

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

            await DiscountOrderCommand(Id, amount);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}