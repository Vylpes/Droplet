import { Request } from "express";

export default class MessageHelper {
    private _req: Request;

    constructor(req: Request) {
        this._req = req;
    }

    public async Info(text: string): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this._req.flash('info', text);

            this._req.session.save((err: string) => {
                if (err) return reject();

                return resolve();
            });
        });
    }

    public async Error(text: string): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this._req.flash('error', text);

            this._req.session.save((err: string) => {
                if (err) return reject();

                return resolve();
            });
        });
    }
}