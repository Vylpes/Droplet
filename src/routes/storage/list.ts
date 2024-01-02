import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { StorageType, StorageTypeParse } from "../../constants/StorageType";
import { Page } from "../../contracts/Page"
import { UserMiddleware } from "../../middleware/userMiddleware";
import GetAllStorageBinsByUnitId from "../../domain/queries/Storage/GetAllStorageBinsByUnitId";
import Storage from "../../domain/models/Storage/Storage";
import GetAllStorageUnitsByBuildingId from "../../domain/queries/Storage/GetAllStorageUnitsByBuildingId";
import GetAllStorageBuildings from "../../domain/queries/Storage/GetAllStorageBuildings";
import GetOneStorageByBinId from "../../domain/queries/Storage/GetOneStorageByBinId";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/list/:type/:id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            let type = req.params.type;
            let Id = req.params.id;

            let storages: Storage[];

            let storage: Storage;

            if (type != 'building' && Id) {
                storage = await GetOneStorageByBinId(Id);
            }

            switch(type) {
                case 'bin':
                    storages = await GetAllStorageBinsByUnitId(Id);
                    break;
                case 'unit':
                    storages = await GetAllStorageUnitsByBuildingId(Id);
                    break;
                case 'building':
                    storages = await GetAllStorageBuildings();
                    break;
                default:
                    next(createHttpError(404));
                    return;
            }

            res.locals.viewData.storages = storages;
            res.locals.viewData.storage = storage;

            res.render(`storage/list/${type}`, res.locals.viewData);
        });
    }
}