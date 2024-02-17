import { NextFunction, Request, Response, Router } from "express";
import Page from "../../contracts/Page";
import { ItemPurchase } from "../../database/entities/ItemPurchase";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class UpdateStatus implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("status")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/item-purchases/view/${Id}`);
            return;
        }

        const status = req.body.status;

        const purchase = await ItemPurchase.FetchOneById(ItemPurchase, Id);

        purchase.UpdateStatus(status);

        await purchase.Save(ItemPurchase, purchase);

        res.redirect(`/item-purchases/view/${Id}`);
    }
}