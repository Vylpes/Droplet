import { Request, Response } from "express";
import Page from "../../contracts/Page";
import PostagePolicy from "../../database/entities/PostagePolicy";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("name")
                .NotEmpty()
            .ChangeField("costToBuyer")
                .NotEmpty()
                .Number()
            .ChangeField("actualCost")
                .NotEmpty()
                .Number();

        const id = req.params.id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/postage-policies/${id}`);
            return;
        }

        const name = req.body.name;
        const costToBuyer = req.body.costToBuyer;
        const actualCost = req.body.actualCost;

        const policy = await PostagePolicy.FetchOneById(PostagePolicy, id);

        policy.UpdateBasicDetails(name, costToBuyer, actualCost);

        await policy.Save(PostagePolicy, policy);

        res.redirect(`/postage-policies/${id}`);
    }
}