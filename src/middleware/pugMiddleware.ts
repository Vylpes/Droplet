import { Request, Response, NextFunction } from "express";

export class PugMiddleware {
    public static GetBaseString(req: Request, res: Response, next: NextFunction) {
        res.locals.viewData = {
            title: 'Droplet',
            message: res.locals.message,
            error: res.locals.error,
            isAuthenticated: req.session.User != null,
            user: req.session.User,
        };

        next();
    }
}