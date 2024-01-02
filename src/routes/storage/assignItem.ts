import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { Storage } from "../../database/entities/Storage";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import AssignStorageToItemCommand from "../../domain/commands/Item/AssignStorageToItemCommand";

export default class AssignItem extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("itemId")
                .NotEmpty();

        super.router.post('/:storageId/:unitId/:binId/assign-item', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const storageId = req.params.storageId;
            const unitId = req.params.unitId;
            const binId = req.params.binId;

            if (req.session.id) {
                res.redirect(`/storage/${storageId}/${unitId}/${binId}/view`);
                return;
            }

            const itemId = req.body.itemId;

            await AssignStorageToItemCommand(itemId, storageId, unitId, binId);

            res.redirect(`/storage/${storageId}/${unitId}/${binId}/view`);
        });
    }
}