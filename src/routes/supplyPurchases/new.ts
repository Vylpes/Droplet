import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import CreateSupplyPurchaseCommand from "../../domain/commands/SupplyPurchase/CreateSupplyPurchaseCommand";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("description", "/supply-purchases/ordered")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        super.router.post('/new', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const description = req.body.description;
            const price = req.body.price;

            await CreateSupplyPurchaseCommand(description, price);

            res.redirect('/supply-purchases/ordered');
        });
    }
}