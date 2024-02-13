import { Request, Response } from "express";
import Page from "../../contracts/Page";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("description")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!bodyValidation.Validate(req.body)) {
            res.redirect(`/supply-purchases/view/${Id}`);
            return;
        }

        const description = req.body.description;
        const price = req.body.price;

        const purchase = await SupplyPurchase.FetchOneById(SupplyPurchase, Id, [
            "Supplies"
        ]);

        purchase.UpdateBasicDetails(description, price);

        await purchase.Save(SupplyPurchase, purchase);
        await purchase.CalculateItemPrices();

        res.redirect(`/supply-purchases/view/${Id}`);
    }
}