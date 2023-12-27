import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import MessageHelper from "../../helpers/MessageHelper";
import AssignPostagePolicyToListingCommand from "../../domain/commands/Listing/AssignPostagePolicyToListingCommand";

export default class AssignPostagePolicy extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("policyId")
                .NotEmpty();

        super.router.post('/view/:Id/assign-postage-policy', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/listings/view/${Id}`);
                return;
            }

            const policyId = req.body.policyId;

            await AssignPostagePolicyToListingCommand(Id, policyId);

            res.redirect(`/listings/view/${Id}`);
        });
    }
}