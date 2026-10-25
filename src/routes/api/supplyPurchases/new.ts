import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import { SupplyPurchase } from "../../../database/entities/SupplyPurchase";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapSupplyPurchase } from "../../../dto";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("description")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const description = req.body.description;
        const price = req.body.price;

        const purchase = new SupplyPurchase(description, price);

        await purchase.Save(SupplyPurchase, purchase);

        res.json(GenerateResponse(true, "Purchase created", mapSupplyPurchase(purchase)));
    }
}
