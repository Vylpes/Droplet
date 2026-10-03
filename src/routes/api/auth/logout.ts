import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";

export default class Logout implements Page {
    public OnPost(req: Request, res: Response) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json(GenerateResponse(false, "Failed to log out"));
                return;
            }

            res.clearCookie("connect.sid");
            res.json(GenerateResponse(true, "Logged out"));
        });
    }
}
