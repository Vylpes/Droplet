import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Listing from "../../contracts/entities/Listing/Listing";
import PostagePolicy from "../../contracts/entities/PostagePolicy/PostagePolicy";
import MessageHelper from "../../helpers/MessageHelper";

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

            const policyMaybe = await ConnectionHelper.FindOne<PostagePolicy>("postage-policy", { uuid: policyId, archived: false });

            if (!policyMaybe.IsSuccess) {
                const message = new MessageHelper(req);
                await message.Error("Unable to find policy");

                res.redirect(`/listings/view/${Id}`);
                return;
            }

            const policy = policyMaybe.Value!;

            await ConnectionHelper.UpdateOne<Listing>("listing", { uuid: Id }, { $set: { postagePolicy: { uuid: policy.uuid, name: policy.name, costToBuyer: policy.costToBuyer, actualCost: policy.actualCost } }});

            res.redirect(`/listings/view/${Id}`);
        });
    }
}