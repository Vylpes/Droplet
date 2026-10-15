import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class UpdateQuantity implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new BodyValidator("unlisted")
                .NotEmpty()
                .Number()
                .GreaterThan(-1)
                .WithMessage("unlisted must be 0 or greater")
            .ChangeField("listed")
                .NotEmpty()
                .Number()
                .GreaterThan(-1)
                .WithMessage("listed must be 0 or greater")
            .ChangeField("sold")
                .NotEmpty()
                .Number()
                .GreaterThan(-1)
                .WithMessage("sold must be 0 or greater")
            .ChangeField("rejected")
                .NotEmpty()
                .Number()
                .GreaterThan(-1)
                .WithMessage("rejected must be 0 or greater");

        const itemId = (req.params.itemId as string);

        if (!await bodyValidation.Validate(req)) {
            res.redirect(`/items/${itemId}`);
            return;
        }

        const unlisted = req.body.unlisted;
        const listed = req.body.listed;
        const sold = req.body.sold;
        const rejected = req.body.rejected;

        const item = await Item.FetchOneById<Item>(Item, itemId);

        item.EditQuantities(unlisted, listed, sold, rejected);

        await item.Save(Item, item);

        res.redirect(`/items/${itemId}`);
    }
}