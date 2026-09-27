import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Item } from "../../../database/entities/Item";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapItem } from "../../../dto";

export default class UpdateQuantity implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("unlisted")
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

        const itemId = (req.params.itemId as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const unlisted = req.body.unlisted;
        const listed = req.body.listed;
        const sold = req.body.sold;
        const rejected = req.body.rejected;

        const item = await Item.FetchOneById<Item>(Item, itemId);

        item.EditQuantities(unlisted, listed, sold, rejected);

        await item.Save(Item, item);

        res.json(GenerateResponse(true, "Quantities updated", mapItem(item)));
    }
}
