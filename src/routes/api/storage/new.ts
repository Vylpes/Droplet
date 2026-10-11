import { Request, Response } from "express";
import { StorageType } from "../../../constants/StorageType";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import { Storage } from "../../../database/entities/Storage";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapStorage } from "../../../dto";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("type")
                .NotEmpty()
            .ChangeField("name")
                .NotEmpty()
            .ChangeField("skuPrefix")
                .NotEmpty()
            .ChangeField("parentId")
                .NotEmpty()
                .When((req: Request) => req.body.type != 'building');

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const type = req.body.type;
        const name = req.body.name;
        const skuPrefix = req.body.skuPrefix;
        const parentId = req.body.parentId;

        const storageType = () => {
            switch(type) {
                case 'bin':
                    return StorageType.Bin;
                case 'unit':
                    return StorageType.Unit;
                case 'building':
                    return StorageType.Building;
                default:
                    return StorageType.Building;
            }
        };

        let parent: Storage | undefined;

        if (parentId) {
            parent = await Storage.FetchOneById(Storage, parentId);
        }

        let storage = new Storage(name, skuPrefix, storageType());

        await storage.Save(Storage, storage);

        if (parent) {
            storage = await Storage.FetchOneById(Storage, storage.Id);

            storage.AssignParentStorage(parent);

            await storage.Save(Storage, storage);
        }

        res.json(GenerateResponse(true, "Storage created", mapStorage(storage)));
    }
}
