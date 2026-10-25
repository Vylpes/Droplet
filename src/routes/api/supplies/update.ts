import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import { Supply } from "../../../database/entities/Supply";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapSupply } from "../../../dto";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("name")
                .NotEmpty()
            .ChangeField("sku")
                .NotEmpty();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const name = req.body.name;
        const sku = req.body.sku;

        const supply = await Supply.FetchOneById<Supply>(Supply, Id);

        supply.EditBasicDetails(name, sku);

        await supply.Save(Supply, supply);

        res.json(GenerateResponse(true, "Supply updated", mapSupply(supply)));
    }
}
