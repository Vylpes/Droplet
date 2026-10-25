import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import { Supply } from "../../../database/entities/Supply";
import { SupplyPurchase } from "../../../database/entities/SupplyPurchase";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapSupply } from "../../../dto";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidationWithId = new ApiBodyValidator("purchaseId")
                .NotEmpty();

        const purchaseIdError = bodyValidationWithId.Validate(req);
        if (purchaseIdError) {
            res.status(400).json(GenerateValidationResponse(purchaseIdError));
            return;
        }

        const bodyValidation = new ApiBodyValidator("name")
                .NotEmpty()
            .ChangeField("sku")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number()
                .GreaterThan(-1)
                .WithMessage("quantity must be 0 or greater");

        const name = req.body.name;
        const sku = req.body.sku;
        const quantity = req.body.quantity;
        const purchaseId = req.body.purchaseId;

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const supply = new Supply(name, sku, quantity);

        await supply.Save(Supply, supply);

        const purchase = await SupplyPurchase.FetchOneById(SupplyPurchase, purchaseId, {
            Supplies: true
        });

        purchase.AddSupplyToOrder(supply);

        await purchase.Save(SupplyPurchase, purchase);
        await purchase.CalculateItemPrices();

        res.json(GenerateResponse(true, "Supply created", mapSupply(supply)));
    }
}
