import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { ItemPurchase } from "../../../database/entities/ItemPurchase";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapItemPurchase } from "../../../dto";

export default class UpdateStatus implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("status")
                .NotEmpty()
                .Number();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const status = req.body.status;

        const purchase = await ItemPurchase.FetchOneById(ItemPurchase, Id);

        purchase.UpdateStatus(status);

        await purchase.Save(ItemPurchase, purchase);

        res.json(GenerateResponse(true, "Status updated", mapItemPurchase(purchase)));
    }
}
