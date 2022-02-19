import { Router } from "express";
import { Route } from "../contracts/Route";
import AddNote from "./supplyPurchases/addNote";
import list from "./supplyPurchases/list";
import newPage from "./supplyPurchases/new";
import Update from "./supplyPurchases/update";
import UpdateStatus from "./supplyPurchases/updateStatus";
import view from "./supplyPurchases/view";

export default class SupplyPurchasesRouter extends Route {
    private list: list;
    private create: newPage;
    private view: view;
    private update: Update;
    private updateStatus: UpdateStatus;
    private addNote: AddNote;

    constructor() {
        super();

        this.list = new list(this.router);
        this.create = new newPage(super.router);
        this.view = new view(super.router);
        this.update = new Update(super.router);
        this.updateStatus = new UpdateStatus(super.router);
        this.addNote = new AddNote(super.router);
    }

    public Route(): Router {
        this.list.Route();
        this.create.Route();
        this.view.Route();
        this.update.Route();
        this.updateStatus.Route();
        this.addNote.Route();

        return this.router;
    }
}