"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
const typeorm_1 = require("typeorm");
const app_1 = require("./app");
class Index {
    constructor() {
        typeorm_1.createConnection().then(async (_) => {
            this._app = new app_1.App();
            this._app.Start(3000);
        }).catch(e => console.error(e));
    }
}
exports.Index = Index;
const p = new Index();
//# sourceMappingURL=index.js.map