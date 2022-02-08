"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("../../contracts/Page");
const Item_1 = require("../../entity/Item");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class List extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnGet() {
        super.router.get('/', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const items = await Item_1.Item.GetAllItems();
            res.locals.items = items;
            res.render('items/list');
        });
    }
}
exports.default = List;
//# sourceMappingURL=list.js.map