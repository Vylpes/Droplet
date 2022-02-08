"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PugMiddleware = void 0;
class PugMiddleware {
    static GetBaseString(req, res, next) {
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
exports.PugMiddleware = PugMiddleware;
//# sourceMappingURL=pugMiddleware.js.map