import { Request, Response, NextFunction } from "express";

export class PugMiddleware {
    public static GetBaseString(req: Request, res: Response, next: NextFunction) {
        res.locals.viewData = {
            title: 'Droplet',
            info: req.flash('info'),
            error: req.flash('error'),
            isAuthenticated: req.session.User != null,
            user: req.session.User,
        };

        next();
    }
}