import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Supply } from "../../../database/entities/Supply";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapSupply } from "../../../dto";

export default class UpdateQuantity implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("unused")
                .NotEmpty()
                .Number()
            .ChangeField("used")
                .NotEmpty()
                .Number();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const unused = req.body.unused;
        const used = req.body.used;

        const supply = await Supply.FetchOneById<Supply>(Supply, Id);

        supply.SetStock(unused, used);

        await supply.Save(Supply, supply);

        res.json(GenerateResponse(true, "Quantities updated", mapSupply(supply)));
    }
}
