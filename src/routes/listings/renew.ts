import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Listing from "../../contracts/entities/Listing/Listing";

export default class Renew extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("endDate")
                .NotEmpty();

        super.router.post('/view/:Id/renew', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/listings/view/${Id}`);
                return;
            }

            const endDate = req.body.endDate;

            await ConnectionHelper.UpdateOne<Listing>("listing", { uuid: Id }, { $inc: { timesRelisted: 1 }, endDate: endDate });

            res.redirect(`/listings/view/${Id}`);
        });
    }
}