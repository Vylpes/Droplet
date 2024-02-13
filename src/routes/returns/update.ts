import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { Return } from "../../database/entities/Return";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("returnNumber")
                .NotEmpty()
            .ChangeField("returnBy")
                .NotEmpty();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/returns/view/${Id}`);
            return;
        }

        const returnNumber = req.body.returnNumber;
        const returnBy = req.body.returnBy;

        const ret = await Return.FetchOneById(Return, Id);

        ret.UpdateBasicDetails(returnNumber, ret.RMA, returnBy);

        await ret.Save(Return, ret);

        res.redirect(`/returns/view/${Id}`);
    }
}