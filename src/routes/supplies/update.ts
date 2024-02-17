import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { Supply } from "../../database/entities/Supply";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("name")
                .NotEmpty()
            .ChangeField("sku")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req)) {
            res.redirect(`/supplies/${Id}`);
            return;
        }

        const name = req.body.name;
        const sku = req.body.sku;
        const quantity = req.body.quantity;

        const supply = await Supply.FetchOneById<Supply>(Supply, Id);

        supply.EditBasicDetails(name, sku);

        await supply.Save(Supply, supply);

        res.redirect(`/supplies/${Id}`);
    }
}