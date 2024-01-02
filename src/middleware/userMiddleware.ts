import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export class UserMiddleware {
    public static Authorise(req: Request, res: Response, next: NextFunction) {
        if (req.session.User) {
            next();
        } else {
            req.session.error = "Access denied";
            res.redirect('/auth/login');
        }
    }

    public static AdminAuthorise(req: Request, res: Response, next: NextFunction) {
        if (req.session.User && req.session.User!.admin) {
            next();
        } else {
            next(createHttpError(403));
        }
    }
}
