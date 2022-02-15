import { Router } from "express";
import { Route } from "../contracts/Route";
import list from "./itemPurchases/list";
import newPage from "./itemPurchases/new";
import Update from "./itemPurchases/update";
import UpdateStatus from "./itemPurchases/updateStatus";
import view from "./itemPurchases/view";

export default class PurchasesRouter extends Route {
    private list: list;
    private create: newPage;
    private view: view;
    private update: Update;
    private updateStatus: UpdateStatus;

    constructor() {
        super();

        this.list = new list(this.router);
        this.create = new newPage(super.router);
        this.view = new view(super.router);
        this.update = new Update(super.router);
        this.updateStatus = new UpdateStatus(super.router);
    }

    public Route(): Router {
        this.list.Route();
        this.create.Route();
        this.view.Route();
        this.update.Route();
        this.updateStatus.Route();

        return this.router;
    }
}