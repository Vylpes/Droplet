import { Request, Response } from "express";
import Page from "../../contracts/Page";
import { Supply } from "../../database/entities/Supply";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidationWithId = new BodyValidator("purchaseId")
                .NotEmpty();

        if (!await bodyValidationWithId.Validate(req)) {
            res.redirect("/supply-purchases/ordered");
            return;
        }

        const bodyValidation = new BodyValidator("name")
                .NotEmpty()
            .ChangeField("sku")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number();

        const name = req.body.name;
        const sku = req.body.sku;
        const quantity = req.body.quantity;
        const purchaseId = req.body.purchaseId;

        if (!await bodyValidation.Validate(req)) {
            res.redirect(`/supply-purchases/view/${purchaseId}`);
            return;
        }

        const supply = new Supply(name, sku, quantity);

        await supply.Save(Supply, supply);

        const purchase = await SupplyPurchase.FetchOneById(SupplyPurchase, purchaseId, [
            "Supplies"
        ]);

        purchase.AddSupplyToOrder(supply);

        await purchase.Save(SupplyPurchase, purchase);
        await purchase.CalculateItemPrices();

        res.redirect(`/supply-purchases/view/${purchaseId}`);
    }
}