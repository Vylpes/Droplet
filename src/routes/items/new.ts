import { Request, Response } from "express";
import Page from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { ItemPurchase } from "../../database/entities/ItemPurchase";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("name")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number()
            .ChangeField("purchaseId")
                .NotEmpty();

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect("/item-purchases/ordered");
            return;
        }

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
    }
}