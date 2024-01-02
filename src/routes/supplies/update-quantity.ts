import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Supply } from "../../database/entities/Supply";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import UpdateSupplyQuantityCommand from "../../domain/commands/Supply/UpdateSupplyQuantityCommand";

export default class UpdateQuantity extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("unused")
                .NotEmpty()
                .Number()
            .ChangeField("used")
                .NotEmpty()
                .Number();

        super.router.post('/:Id/update-quantity', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/supplies/${Id}`);
                return;
            }

            const unused = req.body.unused;
            const used = req.body.used;

            await UpdateSupplyQuantityCommand(Id, unused, used);

            res.redirect(`/supplies/${Id}`);
        });
    }
}