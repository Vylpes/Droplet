"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddleware = void 0;
class UserMiddleware {
    static Authorise(req, res, next) {
        if (req.session.User) {
            next();
        }
        else {
            req.session.error = "Access denied";
            res.redirect('/auth/login');
        }
    }
}
exports.UserMiddleware = UserMiddleware;
//# sourceMappingURL=userMiddleware.js.map