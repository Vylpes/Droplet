import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import { Return } from "../../../database/entities/Return";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapReturn } from "../../../dto";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("returnNumber")
                .NotEmpty()
            .ChangeField("returnBy")
                .NotEmpty();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const returnNumber = req.body.returnNumber;
        const returnBy = req.body.returnBy;

        const ret = await Return.FetchOneById(Return, Id);

        ret.UpdateBasicDetails(returnNumber, ret.RMA, returnBy);

        await ret.Save(Return, ret);

        res.json(GenerateResponse(true, "Return updated", mapReturn(ret)));
    }
}
