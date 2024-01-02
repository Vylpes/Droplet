import { NextFunction, Request, Response, Router } from "express";
import { StorageType } from "../../constants/StorageType";
import { Page } from "../../contracts/Page"
import { Item } from "../../database/entities/Item";
import { Storage } from "../../database/entities/Storage";
import { UserMiddleware } from "../../middleware/userMiddleware";
import GetOneStorageByBinId from "../../domain/queries/Storage/GetOneStorageByBinId";
import GetAllStoragesByType from "../../domain/queries/Storage/GetAllStoragesByType";
import GetAllItemsNotAssignedToStorage from "../../domain/queries/Item/GetAllItemsNotAssignedToStorage";

export default class View extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/view/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            let id = req.params.Id;

            const storage = await GetOneStorageByBinId(id);
            const bins = await GetAllStoragesByType(StorageType.Bin);
            const items = await GetAllItemsNotAssignedToStorage();

            res.locals.viewData.storage = storage.bin;
            res.locals.viewData.items = items;
            res.locals.viewData.bins = bins;

            res.render(`storage/view`, res.locals.viewData);
        });
    }
}