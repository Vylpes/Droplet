import { Request, Response } from "express";
import Page from "../../contracts/Page";
import { Return } from "../../database/entities/Return";

export default class Posted implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const Id = req.params.Id;

        const ret = await Return.FetchOneById(Return, Id);

        ret.MarkAsPosted();

        await ret.Save(Return, ret);

        res.redirect(`/returns/view/${Id}`);
    }
}