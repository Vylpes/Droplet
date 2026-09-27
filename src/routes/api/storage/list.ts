import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { StorageType } from "../../../constants/StorageType";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Storage } from "../../../database/entities/Storage";
import { mapStorage } from "../../../dto";

export default class List implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const type = (req.params.type as string);
        const Id = (req.params.id as string);

        const storages = await Storage.FetchAll(Storage, {
            Items: true,
            Children: true
        });

        let storage: Storage | undefined;

        if (type != 'building' && Id) {
            storage = await Storage.FetchOneById(Storage, Id, {
                Parent: true
            });
        }

        let visible: Storage[];

        switch(type) {
            case 'bin':
                visible = storages.filter(x => x.StorageType == StorageType.Bin);
                break;
            case 'unit':
                visible = storages.filter(x => x.StorageType == StorageType.Unit);
                break;
            case 'building':
                visible = storages.filter(x => x.StorageType == StorageType.Building);
                break;
            default:
                next(createHttpError(404));
                return;
        }

        res.json(GenerateResponse(true, undefined, {
            Storages: visible.map(s => mapStorage(s, true, true)),
            Storage: storage ? mapStorage(storage) : undefined
        }));
    }
}
