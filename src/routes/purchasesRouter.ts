import { Router } from "express";
import { Route } from "../contracts/Route";
import list from "./purchases/list";
import newPage from "./purchases/new";
import Update from "./purchases/update";
import view from "./purchases/view";

export default class PurchasesRouter extends Route {
    private list: list;
    private create: newPage;
    private view: view;
    private update: Update;

    constructor() {
        super();

        this.list = new list(this.router);
        this.create = new newPage(super.router);
        this.view = new view(super.router);
        this.update = new Update(super.router);
    }

    public Route(): Router {
        this.list.Route();
        this.create.Route();
        this.view.Route();
        this.update.Route();

        return this.router;
    }
}