"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = void 0;
const Page_1 = require("../../contracts/Page");
class Logout extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/logout', (req, res) => {
            req.session.destroy(() => {
                res.redirect('/');
            });
        });
    }
}
exports.Logout = Logout;
//# sourceMappingURL=logout.js.map