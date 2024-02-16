import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { Supply } from "../../database/entities/Supply";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class UpdateQuantity implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("unused")
                .NotEmpty()
                .Number()
            .ChangeField("used")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req)) {
            res.redirect(`/supplies/${Id}`);
            return;
        }

        const unused = req.body.unused;
        const used = req.body.used;

        const supply = await Supply.FetchOneById<Supply>(Supply, Id);

        supply.SetStock(unused, used);

        await supply.Save(Supply, supply);

        res.redirect(`/supplies/${Id}`);
    }
}