import { Router } from "express";
import { Route } from "../contracts/Route";
import AssignListing from "./orders/assignListing";
import Paid from "./orders/paid";
import list from "./orders/list";
import newPage from "./orders/new";
import Dispatch from "./orders/dispatch";
import Update from "./orders/update";
import view from "./orders/view";
import Discount from "./orders/discount";
import AssignSupply from "./orders/assignSupply";
import AssignTrackingNumber from "./orders/assignTrackingNumber";
import AddNote from "./orders/addNote";

export default class OrdersRouter extends Route {
    private list: list;
    private create: newPage;
    private view: view;
    private update: Update;
    private assignListing: AssignListing;
    private assignSupply: AssignSupply;
    private assignTrackingNumber: AssignTrackingNumber;
    private paid: Paid;
    private dispatch: Dispatch;
    private discount: Discount;
    private addNote: AddNote;

    constructor() {
        super();

        this.list = new list(this.router);
        this.create = new newPage(super.router);
        this.view = new view(super.router);
        this.update = new Update(super.router);
        this.assignListing = new AssignListing(super.router);
        this.assignSupply = new AssignSupply(super.router);
        this.assignTrackingNumber = new AssignTrackingNumber(super.router);
        this.paid = new Paid(super.router);
        this.dispatch = new Dispatch(super.router);
        this.discount = new Discount(super.router);
        this.addNote = new AddNote(super.router);
    }

    public Route(): Router {
        this.list.Route();
        this.create.Route();
        this.view.Route();
        this.update.Route();
        this.assignListing.Route();
        this.assignSupply.Route();
        this.assignTrackingNumber.Route();
        this.paid.Route();
        this.dispatch.Route();
        this.discount.Route();
        this.addNote.Route();

        return this.router;
    }
}