import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { Storage } from "../../database/entities/Storage";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class AssignItem implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("itemId")
                .NotEmpty();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req)) {
            res.redirect(`/storage/view/${Id}`);
            return;
        }

        const itemId = req.body.itemId;

        const storage = await Storage.FetchOneById(Storage, Id, [
            "Items"
        ]);

        let item = await Item.FetchOneById(Item, itemId, [
            "Storage"
        ]);

        storage.AddItemToBin(item);

        await storage.Save(Storage, storage);

        item = await Item.FetchOneById(Item, itemId, [
            "Storage",
            "Storage.Parent",
            "Storage.Parent.Parent"
        ]);

        item.GenerateSku();

        await item.Save(Item, item);

        res.redirect(`/storage/view/${Id}`);
    }
}