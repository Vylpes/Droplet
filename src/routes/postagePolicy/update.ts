import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import PostagePolicy from "../../entity/PostagePolicy";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/:id/update', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const id = req.params.id;
            const name = req.body.name;
            const costToBuyer = req.body.costToBuyer;
            const actualCost = req.body.actualCost;

            const policy = await PostagePolicy.FetchOneById(PostagePolicy, id);

            policy.UpdateBasicDetails(name, costToBuyer, actualCost);

            await policy.Save(PostagePolicy, policy);

            res.redirect(`/postage-policies/${id}`);
        });
    }
}