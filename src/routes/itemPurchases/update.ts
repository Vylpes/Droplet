import { NextFunction, Request, Response, Router } from "express";
import Page from "../../contracts/Page";
import { ItemPurchase } from "../../database/entities/ItemPurchase";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("description")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/item-purchases/view/${Id}`);
            return;
        }

        const description = req.body.description;
        const price = req.body.price;

        const purchase = await ItemPurchase.FetchOneById(ItemPurchase, Id, [
            "Items"
        ]);

        purchase.UpdateBasicDetails(description, price);

        await purchase.Save(ItemPurchase, purchase);
        await purchase.CalculateItemPrices();

        res.redirect(`/item-purchases/view/${Id}`);
    }
}