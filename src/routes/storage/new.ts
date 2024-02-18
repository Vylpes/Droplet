import { Request, Response } from "express";
import { StorageType } from "../../constants/StorageType";
import Page from "../../contracts/Page";
import { Storage } from "../../database/entities/Storage";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("type")
                .NotEmpty()
            .ChangeField("name")
                .NotEmpty()
            .ChangeField("skuPrefix")
                .NotEmpty()
            .ChangeField("parentId")
                .NotEmpty()
                .When((req: Request) => req.body.type != 'building');

        if (!await bodyValidation.Validate(req)) {
            res.redirect('/storage/list/building/all');
            return;
        }

        const type = req.body.type;
        const name = req.body.name;
        const skuPrefix = req.body.skuPrefix;
        const parentId = req.body.parentId;

        const storageType = () => { switch(type) {
            case 'bin':
                return StorageType.Bin;
            case 'unit':
                return StorageType.Unit;
            case 'building':
                return StorageType.Building;
            default:
                return StorageType.Building;
        }};

        const nextType = () => { switch(storageType()) {
            case StorageType.Building:
                return 'unit';
            case StorageType.Unit:
                return 'bin';
            case StorageType.Bin:
                return 'view';
        }};

        let parent: Storage;

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

        if (nextType() == 'view') {
            res.redirect(`/storage/view/${storage.Id}`);
            return;
        }

        res.redirect(`/storage/list/${nextType()}/${storage.Id}`);
    }
}