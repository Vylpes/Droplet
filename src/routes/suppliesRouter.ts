import { Router } from "express";
import { Route } from "../contracts/Route";
import AddNote from "./supplies/addNote";
import newPage from "./supplies/new";
import Update from "./supplies/update";
import UpdateQuantity from "./supplies/update-quantity";
import view from "./supplies/view";

export default class SuppliesRouters extends Route {
    private create: newPage;
    private view: view;
    private update: Update;
    private updateQuantity: UpdateQuantity;
    private addNote: AddNote;

    constructor() {
        super();

        this.create = new newPage(super.router);
        this.view = new view(super.router);
        this.update = new Update(super.router);
        this.updateQuantity = new UpdateQuantity(super.router);
        this.addNote = new AddNote(super.router);
    }

    public Route(): Router {
        this.create.Route();
        this.view.Route();
        this.update.Route();
        this.updateQuantity.Route();
        this.addNote.Route();

        return this.router;
    }
}