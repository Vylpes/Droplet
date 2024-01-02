import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Supply } from "../../database/entities/Supply";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import CreateSupplyCommand from "../../domain/commands/Supply/CreateSupplyCommand";
import AssignSupplyToPurchaseCommand from "../../domain/commands/SupplyPurchase/AssignSupplyToPurchaseCommand";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidationWithId = new Body("purchaseId", "/supply-purchases/ordered")
                .NotEmpty();

        const bodyValidation = new Body("name")
                .NotEmpty()
            .ChangeField("sku")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number();

        super.router.post('/new',
            UserMiddleware.Authorise,
            bodyValidationWithId.Validate.bind(bodyValidationWithId),
            bodyValidation.Validate.bind(bodyValidation),
            async (req: Request, res: Response) => {
                const name = req.body.name;
                const sku = req.body.sku;
                const quantity = req.body.quantity;
                const purchaseId = req.body.purchaseId;

                if (req.session.error) {
                    res.redirect(`/supply-purchases/view/${purchaseId}`);
                    return;
                }

                const supply = await CreateSupplyCommand(sku, name, quantity);

                await AssignSupplyToPurchaseCommand(supply.uuid, purchaseId);

                res.redirect(`/supply-purchases/view/${purchaseId}`);
            }
        );
    }
}