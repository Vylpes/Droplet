import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Order } from "../../database/entities/Order";
import PostagePolicy from "../../database/entities/PostagePolicy";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import UpdateOrderBasicDetailsCommand from "../../domain/commands/Order/UpdateOrderBasicDetailsCommand";
import AssignPostagePolicyToOrderCommand from "../../domain/commands/Order/AssignPostagePolicyToOrderCommand";
import RemovePostagePolicyFromOrderCommand from "../../domain/commands/Order/RemovePostagePolicyFromOrderCommand";

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

            await UpdateOrderBasicDetailsCommand(Id, orderNumber, offerAccepted, buyer);

            if (postagePolicyId) {
                await AssignPostagePolicyToOrderCommand(Id, postagePolicyId);
            } else {
                await RemovePostagePolicyFromOrderCommand(Id);
            }

            res.redirect(`/orders/view/${Id}`);
        });
    }
}