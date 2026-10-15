import { Request, Response } from "express";
import { StorageType } from "../../../constants/StorageType";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Item } from "../../../database/entities/Item";
import { Storage } from "../../../database/entities/Storage";
import { mapItem, mapStorage } from "../../../dto";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response) {
        const id = (req.params.Id as string);

        const bin = await Storage.FetchOneById(Storage, id, {
            Items: {
                Storage: true
            },
            Parent: true
        });

        const items = await Item.FetchAll(Item, {
            Storage: true
        });

        const storages = await Storage.FetchAll(Storage, {
            Items: true
        });

        res.json(GenerateResponse(true, undefined, {
            Storage: mapStorage(bin, false, true),
            Items: items.filter(x => x.Storage == null).map((item) => mapItem(item)),
            Storages: storages.filter(x => x.StorageType == StorageType.Bin).map(s => mapStorage(s, false, true))
        }));
    }
}
