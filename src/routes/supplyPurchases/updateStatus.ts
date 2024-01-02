import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import UpdateSupplyPurchaseStatusCommand from "../../domain/commands/SupplyPurchase/UpdateSupplyPurchaseStatusCommand";
import { SupplyPurchaseStatusParse } from "../../constants/Status/SupplyPurchaseStatus";

export default class UpdateStatus extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("status")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/update-status', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/supply-purchases/view/${Id}`);
                return;
            }

            const status = req.body.status;

            await UpdateSupplyPurchaseStatusCommand(Id, SupplyPurchaseStatusParse.get(status));

            res.redirect(`/supply-purchases/view/${Id}`);
        });
    }
}