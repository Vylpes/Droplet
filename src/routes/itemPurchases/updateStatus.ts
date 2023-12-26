import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import UpdateItemPurchaseStatusCommand from "../../domain/commands/ItemPurchase/UpdateItemPurchaseStatusCommand";

export default class UpdateStatus extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("status")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/update-status', bodyValidation.Validate.bind(bodyValidation), UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/item-purchases/view/${Id}`);
                return;
            }

            const status = req.body.status;

            await UpdateItemPurchaseStatusCommand(Id, status);

            res.redirect(`/item-purchases/view/${Id}`);
        });
    }
}