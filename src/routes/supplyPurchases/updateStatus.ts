import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class UpdateStatus implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("status")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!bodyValidation.Validate(req.body)) {
            res.redirect(`/supply-purchases/view/${Id}`);
            return;
        }

        const status = req.body.status;

        const purchase = await SupplyPurchase.FetchOneById(SupplyPurchase, Id);

        purchase.UpdateStatus(status);

        await purchase.Save(SupplyPurchase, purchase);

        res.redirect(`/supply-purchases/view/${Id}`);
    }
}