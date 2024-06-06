import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import createHttpError from "http-errors";

export default class UpdateQuantity implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("unlisted")
                .NotEmpty()
                .Number()
            .ChangeField("listed")
                .NotEmpty()
                .Number()
            .ChangeField("sold")
                .NotEmpty()
                .Number()
            .ChangeField("rejected")
                .NotEmpty()
                .Number();

        const itemId = req.params.itemId;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/items/${itemId}`);
            return;
        }

        const unlisted = req.body.unlisted;
        const listed = req.body.listed;
        const sold = req.body.sold;
        const rejected = req.body.rejected;

        const item = await Item.FetchOneById<Item>(Item, itemId);

        if (!item) {
            next(createHttpError(404));
            return;
        }

        item.EditQuantities(unlisted, listed, sold, rejected);

        await item.Save(Item, item);

        res.redirect(`/items/${itemId}`);
    }
}