import { Router } from "express";
import { Route } from "../contracts/Route";
import AddNote from "./items/addNote";
import newPage from "./items/new";
import Update from "./items/update";
import UpdateQuantity from "./items/update-quantity";
import view from "./items/view";

export default class ItemsRouter extends Route {
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