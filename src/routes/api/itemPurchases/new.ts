import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { ItemPurchase } from "../../../database/entities/ItemPurchase";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapItemPurchase } from "../../../dto";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("description")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const description = req.body.description;
        const price = req.body.price;

        const purchase = new ItemPurchase(description, price);

        await purchase.Save(ItemPurchase, purchase);

        res.json(GenerateResponse(true, "Purchase created", mapItemPurchase(purchase)));
    }
}
