import { Request, Response } from "express";
import Page from "../../contracts/Page";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("description")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        if (!bodyValidation.Validate(req.body)) {
            res.redirect('/supply-purchases/ordered');
            return;
        }

        const description = req.body.description;
        const price = req.body.price;

        const purchase = new SupplyPurchase(description, price);

        await purchase.Save(SupplyPurchase, purchase);

        res.redirect('/supply-purchases/ordered');
    }
}