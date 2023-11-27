import { App } from "./app";
import ConnectionHelper from "./helpers/ConnectionHelper";

export class Index {
    private _app: App;

    constructor() {
        this.Initialise();
    }

    async Initialise() {
        this._app = new App();
        await this._app.Start();
    }
}

const p = new Index();