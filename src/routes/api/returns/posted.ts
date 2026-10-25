import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Return } from "../../../database/entities/Return";
import { mapReturn } from "../../../dto";

export default class Posted implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const Id = (req.params.Id as string);

        const ret = await Return.FetchOneById(Return, Id);

        ret.MarkAsPosted();

        await ret.Save(Return, ret);

        res.json(GenerateResponse(true, "Return marked as posted", mapReturn(ret)));
    }
}
