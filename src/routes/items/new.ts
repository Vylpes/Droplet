import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import Item from "../../contracts/entities/ItemPurchase/Item";
import { v4 } from "uuid";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";

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

            const item: Item = {
                uuid: v4(),
                name: name,
                quantities: {
                    unlisted: quantity,
                    listed: 0,
                    sold: 0,
                    rejected: 0,
                },
                status: ItemStatus.Unlisted,
                sku: null,
                notes: [],
                r_storageBin: null,
            };

            await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { uuid: purchaseId }, { $push: { items: item } });

            res.redirect(`/item-purchases/view/${purchaseId}`);
        });
    }
}