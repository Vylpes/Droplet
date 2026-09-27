import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";

export default class Index implements Page {
    OnGet(req: Request, res: Response) {
        res.json(GenerateResponse(true, undefined, {}));
    }
}
