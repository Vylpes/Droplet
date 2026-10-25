import { Request, Response, NextFunction } from "express";
import { GenerateResponse } from "../contracts/IBasicResponse";

export class ApiUserMiddleware {
    public static Authorise(req: Request, res: Response, next: NextFunction) {
        if (req.session.User) {
            next();
        } else {
            res.status(401).json(GenerateResponse(false, "Access denied"));
        }
    }

    public static AdminAuthorise(req: Request, res: Response, next: NextFunction) {
        if (req.session.User && req.session.User.Admin) {
            next();
        } else {
            res.status(403).json(GenerateResponse(false, "Forbidden"));
        }
    }
}
