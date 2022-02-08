"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
class Page {
    constructor(router) {
        this._router = router;
    }
    get router() {
        return this._router;
    }
    Route() {
        this.OnGet();
        this.OnPost();
    }
    OnGet() { }
    OnPost() { }
}
exports.Page = Page;
//# sourceMappingURL=Page.js.map