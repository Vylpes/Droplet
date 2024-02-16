import { Request, Response } from "express";
import { StorageType } from "../../constants/StorageType";
import Page from "../../contracts/Page"
import { Item } from "../../database/entities/Item";
import { Storage } from "../../database/entities/Storage";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response) {
        let id = req.params.Id;

        const bin = await Storage.FetchOneById(Storage, id, [
            "Items",
            "Items.Storage",
            "Parent"
        ]);

        const items = await Item.FetchAll(Item, [
            "Storage"
        ]);

        const storages = await Storage.FetchAll(Storage, [
            "Items"
        ]);

        res.locals.viewData.storage = bin;
        res.locals.viewData.items = items.filter(x => x.Storage == null);
        res.locals.viewData.storages = storages.filter(x => x.StorageType == StorageType.Bin);

        res.render(`storage/view`, res.locals.viewData);
    }
}