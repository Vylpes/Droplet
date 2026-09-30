import { Request, Response } from "express";
import Page from "../../../../contracts/Page";
import { GenerateResponse } from "../../../../contracts/IBasicResponse";
import { User } from "../../../../database/entities/User";
import { mapUser } from "../../../../dto";

export default class List implements Page {
    public async OnGetAsync(req: Request, res: Response) {
        const users = await User.FetchAll(User);

        res.json(GenerateResponse(true, undefined, users.map(mapUser)));
    }
}
