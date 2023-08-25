import { App } from "./app";

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