import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { ItemPurchase } from "../../database/entities/ItemPurchase";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

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

            const item = new Item(name, quantity);

            await item.Save(Item, item);

            let purchase = await ItemPurchase.FetchOneById(ItemPurchase, purchaseId, [
                "Items"
            ]);

            purchase.AddItemToOrder(item);

            await purchase.Save(ItemPurchase, purchase);

            purchase = await ItemPurchase.FetchOneById(ItemPurchase, purchaseId, [
                "Items"
            ]);

            await purchase.CalculateItemPrices();

            res.redirect(`/item-purchases/view/${purchaseId}`);
        });
    }
}