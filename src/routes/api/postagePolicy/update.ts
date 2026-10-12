import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import PostagePolicy from "../../../database/entities/PostagePolicy";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapPostagePolicy } from "../../../dto";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("name")
                .NotEmpty()
            .ChangeField("costToBuyer")
                .NotEmpty()
                .Number()
            .ChangeField("actualCost")
                .NotEmpty()
                .Number();

        const id = (req.params.id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const name = req.body.name;
        const costToBuyer = req.body.costToBuyer;
        const actualCost = req.body.actualCost;

        const policy = await PostagePolicy.FetchOneById(PostagePolicy, id);

        policy.UpdateBasicDetails(name, costToBuyer, actualCost);

        await policy.Save(PostagePolicy, policy);

        res.json(GenerateResponse(true, "Postage policy updated", mapPostagePolicy(policy)));
    }
}
