import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { v4 } from "uuid";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import CreateItemCommand from "../../domain/commands/Item/CreateItemCommand";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("name")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number()
            .ChangeField("purchaseId")
                .NotEmpty();

        super.router.post('/new', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const name = req.body.name;
            const quantity = req.body.quantity;
            const purchaseId = req.body.purchaseId;

            await CreateItemCommand(name, quantity, purchaseId);

            res.redirect(`/item-purchases/view/${purchaseId}`);
        });
    }
}