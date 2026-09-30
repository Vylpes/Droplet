import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Item } from "../../../database/entities/Item";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapItem } from "../../../dto";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("name")
                .NotEmpty();

        const itemId = (req.params.itemId as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const name = req.body.name;

        const item = await Item.FetchOneById<Item>(Item, itemId);

        item.EditBasicDetails(name);

        await item.Save(Item, item);

        res.json(GenerateResponse(true, "Item updated", mapItem(item)));
    }
}
