"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
const userMiddleware_1 = require("../../middleware/userMiddleware");
const Page_1 = require("../../contracts/Page");
class Index extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/', userMiddleware_1.UserMiddleware.Authorise, (req, res) => {
            res.render('dashboard/index', res.locals.viewData);
        });
    }
}
exports.Index = Index;
//# sourceMappingURL=index.js.map