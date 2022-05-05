import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Listing } from "../../entity/Listing";
import PostagePolicy from "../../entity/PostagePolicy";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

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

            const policy = await PostagePolicy.FetchOneById(PostagePolicy, policyId);

            const listing = await Listing.FetchOneById(Listing, Id, [
                "PostagePolicy"
            ]);

            listing.AddPostagePolicyToListing(policy);

            await listing.Save(Listing, listing);

            res.redirect(`/listings/view/${Id}`);
        });
    }
}