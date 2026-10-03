import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { mapUser } from "../../../dto";

export default class Me implements Page {
    public OnGet(req: Request, res: Response) {
        const user = req.session.User;

        if (!user) {
            res.status(401).json(GenerateResponse(false, "Not authenticated"));
            return;
        }

        res.json(GenerateResponse(true, undefined, mapUser(user)));
    }
}
