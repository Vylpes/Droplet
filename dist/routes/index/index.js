"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
const Page_1 = require("../../contracts/Page");
class Index extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/', (req, res) => {
            if (res.locals.viewData.isAuthenticated) {
                res.redirect('/dashboard');
            }
            res.render('index/index', res.locals.viewData);
        });
    }
}
exports.Index = Index;
//# sourceMappingURL=index.js.map