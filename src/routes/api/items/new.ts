import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Item } from "../../../database/entities/Item";
import { ItemPurchase } from "../../../database/entities/ItemPurchase";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapItem } from "../../../dto";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("name")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number()
            .ChangeField("purchaseId")
                .NotEmpty();

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const name = req.body.name;
        const quantity = req.body.quantity;
        const purchaseId = req.body.purchaseId;

        const item = new Item(name, quantity);

        await item.Save(Item, item);

        let purchase = await ItemPurchase.FetchOneById(ItemPurchase, purchaseId, {
            Items: true
        });

        purchase.AddItemToOrder(item);

        await purchase.Save(ItemPurchase, purchase);

        purchase = await ItemPurchase.FetchOneById(ItemPurchase, purchaseId, {
            Items: true
        });

        await purchase.CalculateItemPrices();

        res.json(GenerateResponse(true, "Item created", mapItem(item)));
    }
}
