import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import createHttpError from "http-errors";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("name")
                .NotEmpty();

        const itemId = req.params.itemId;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/items/${itemId}`);
            return;
        }

        const name = req.body.name;

        const item = await Item.FetchOneById<Item>(Item, itemId);

        if (!item) {
            next(createHttpError(404));
            return;
        }

        item.EditBasicDetails(name);

        await item.Save(Item, item);

        res.redirect(`/items/${itemId}`);
    }
}