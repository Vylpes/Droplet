import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { SupplyPurchase } from "../../../database/entities/SupplyPurchase";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapSupplyPurchase } from "../../../dto";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("description")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const description = req.body.description;
        const price = req.body.price;

        const purchase = await SupplyPurchase.FetchOneById(SupplyPurchase, Id, {
            Supplies: true
        });

        purchase.UpdateBasicDetails(description, price);

        await purchase.Save(SupplyPurchase, purchase);
        await purchase.CalculateItemPrices();

        res.json(GenerateResponse(true, "Purchase updated", mapSupplyPurchase(purchase, true)));
    }
}
