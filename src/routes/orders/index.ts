import { Route } from "../../contracts/Route";
import AddNote from "./addNote";
import AssignListing from "./assignListing";
import AssignSupply from "./assignSupply";
import AssignTrackingNumber from "./assignTrackingNumber";
import Discount from "./discount";
import Dispatch from "./dispatch";
import List from "./list";
import New from "./new";
import Paid from "./paid";
import Update from "./update";
import View from "./view";

export default class OrdersRouter extends Route {
    constructor() {
        super(true);

        this.AddPage("/:Id/add-note", new AddNote());
        this.AddPage("/view/:Id/assign-listing", new AssignListing());
        this.AddPage("/view/:Id/assign-supply", new AssignSupply());
        this.AddPage("/view/:Id/assign-tracking-number", new AssignTrackingNumber());
        this.AddPage("/view/:Id/discount", new Discount());
        this.AddPage("/view/:Id/dispatch", new Dispatch());
        this.AddPage("/:status", new List());
        this.AddPage("/new", new New());
        this.AddPage("/view/:Id/paid", new Paid());
        this.AddPage("/view/:Id/update", new Update());
        this.AddPage("/view/:Id", new View());
    }
}