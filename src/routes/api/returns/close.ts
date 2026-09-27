import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Return } from "../../../database/entities/Return";
import { mapReturn } from "../../../dto";

export default class Close implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const Id = (req.params.Id as string);

        const ret = await Return.FetchOneById(Return, Id);

        ret.MarkAsClosed();

        await ret.Save(Return, ret);

        res.json(GenerateResponse(true, "Return closed", mapReturn(ret)));
    }
}
