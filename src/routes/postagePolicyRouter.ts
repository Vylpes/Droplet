import { Router } from "express";
import { Route } from "../contracts/Route";
import List from "./postagePolicy/list";
import New from "./postagePolicy/new";
import Update from "./postagePolicy/update";
import View from "./postagePolicy/view";

export default class PostagePolicyRouter extends Route {
    private _list: List;
    private _new: New;
    private _update: Update;
    private _view: View;

    constructor() {
        super();

        this._list = new List(super.router);
        this._new = new New(super.router);
        this._update = new Update(super.router);
        this._view = new View(super.router);
    }

    public Route(): Router {
        this._list.Route();
        this._new.Route();
        this._update.Route();
        this._view.Route();

        return this.router;
    }
}