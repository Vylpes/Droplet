"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ItemStatus_1 = require("../../constants/ItemStatus");
const Page_1 = require("../../contracts/Page");
const Item_1 = require("../../entity/Item");
const userMiddleware_1 = require("../../middleware/userMiddleware");
class New extends Page_1.Page {
    constructor(router) {
        super(router);
    }
    OnPost() {
        super.router.post('/new', userMiddleware_1.UserMiddleware.Authorise, async (req, res) => {
            const name = req.body.name;
            const sku = req.body.sku;
            const quantity = req.body.quantity;
            const buyPrice = req.body.buyPrice;
            const sellPrice = req.body.sellPrice;
            await Item_1.Item.CreateItem(name, sku, quantity, ItemStatus_1.ItemStatus.Unsold, buyPrice, sellPrice);
            res.redirect('/items');
        });
    }
}
exports.default = New;
//# sourceMappingURL=new.js.map