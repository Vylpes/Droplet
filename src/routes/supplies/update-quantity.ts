import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { Supply } from "../../entity/Supply";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

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

            const supply = await Supply.FetchOneById<Supply>(Supply, Id);

            supply.SetStock(unused, used);

            await supply.Save(Supply, supply);

            res.redirect(`/supplies/${Id}`);
        });
    }
}