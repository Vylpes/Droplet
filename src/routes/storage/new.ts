import { Console } from "console";
import { Request, Response, Router } from "express";
import { ItemPurchaseStatus } from "../../constants/Status/ItemPurchaseStatus";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { StorageType } from "../../constants/StorageType";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { Storage } from "../../entity/Storage";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import List from "../itemPurchases/list";

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
                .NotEmpty();

        super.router.post('/new', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
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
        });
    }
}