import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Supply } from "../../database/entities/Supply";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("name")
                .NotEmpty()
            .ChangeField("sku")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number();

        super.router.post('/:Id/update', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/supplies/${Id}`);
                return;
            }

            const name = req.body.name;
            const sku = req.body.sku;
            const quantity = req.body.quantity;

            const supply = await Supply.FetchOneById<Supply>(Supply, Id);

            supply.EditBasicDetails(name, sku);

            await supply.Save(Supply, supply);

            res.redirect(`/supplies/${Id}`);
        });
    }
}