import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { v4 } from "uuid";
import { ItemPurchaseStatus } from "../../constants/Status/ItemPurchaseStatus";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import CreateItemPurchaseCommand from "../../domain/commands/ItemPurchase/CreateItemPurchaseCommand";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("description", "/item-purchases/ordered")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        super.router.post('/new', bodyValidation.Validate.bind(bodyValidation), UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const description = req.body.description;
            const price = req.body.price;

            await CreateItemPurchaseCommand(description, price);

            res.redirect('/item-purchases/ordered');
        });
    }
}