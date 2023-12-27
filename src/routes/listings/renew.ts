import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import RenewListingCommand from "../../domain/commands/Listing/RenewListingCommand";

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
            
            await RenewListingCommand(Id, endDate);

            res.redirect(`/listings/view/${Id}`);
        });
    }
}