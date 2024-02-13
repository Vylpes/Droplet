import { Request, Response, Router } from "express";
import Page from "../../contracts/Page";
import { ItemPurchase } from "../../database/entities/ItemPurchase";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("description")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect("/item-purchases/ordered");
            return;
        }

        const description = req.body.description;
        const price = req.body.price;

        const purchase = new ItemPurchase(description, price);

        await purchase.Save(ItemPurchase, purchase);

        res.redirect('/item-purchases/ordered');
    }
}