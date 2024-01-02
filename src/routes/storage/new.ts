import { NextFunction, Request, Response, Router } from "express";
import { StorageType, StorageTypeParse } from "../../constants/StorageType";
import { Page } from "../../contracts/Page";
import { Storage } from "../../database/entities/Storage";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import CreateStorageBuildingCommand from "../../domain/commands/Storage/CreateStorageBuildingCommand";
import CreateStorageUnitCommand from "../../domain/commands/Storage/CreateStorageUnitCommand";
import CreateStorageBinCommand from "../../domain/commands/Storage/CreateStorageBinCommand";
import createHttpError from "http-errors";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("type", "/storage/list/building/all")
                .NotEmpty()
            .ChangeField("name")
                .NotEmpty()
            .ChangeField("skuPrefix")
                .NotEmpty()
            .ChangeField("parentId")
                .NotEmpty()
                .When((req: Request) => req.body.type != 'building');

        super.router.post('/new', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const type = req.body.type;
            const name = req.body.name;
            const skuPrefix = req.body.skuPrefix;
            const parentId = req.body.parentId;

            const typeParsed = StorageTypeParse.get(type);

            switch (typeParsed) {
                case StorageType.Bin:
                    const bin = await CreateStorageBinCommand(parentId, name, skuPrefix);
                    res.redirect(`/storage/view/${bin.uuid}`);
                    break;
                case StorageType.Unit:
                    const unit = await CreateStorageUnitCommand(parentId, name, skuPrefix);
                    res.redirect(`/storage/list/unit/${unit.uuid}`);
                    break;
                case StorageType.Building:
                    const building = await CreateStorageBuildingCommand(name, skuPrefix);
                    res.redirect(`/storage/list/building/${building.uuid}`);
                    break;
                default:
                    next(createHttpError(400));
                    return;
            }
        });
    }
}