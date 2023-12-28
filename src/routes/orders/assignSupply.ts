import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { Supply } from "../../database/entities/Supply";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import AssignSupplyToOrderCommand from "../../domain/commands/Order/AssignSupplyToOrderCommand";

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
            // TODO: Remove amount from supply
            const amount = req.body.amount;

            await AssignSupplyToOrderCommand(Id, supplyId);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}