import { Route } from "../../contracts/Route";
import AddNote from "./addNote";
import Close from "./close";
import List from "./list";
import New from "./new";
import Posted from "./posted";
import Received from "./received";
import Refund from "./refund";
import Started from "./started";
import Update from "./update";
import View from "./view";

export default class ReturnsRouter extends Route {
    constructor() {
        super(true);

        this.AddPage("/:Id/add-note", new AddNote());
        this.AddPage("/view/:Id/close", new Close());
        this.AddPage("/:status", new List());
        this.AddPage("/new", new New());
        this.AddPage("/view/:Id/posted", new Posted());
        this.AddPage("/view/:Id/received", new Received());
        this.AddPage("/view/:Id/refund", new Refund());
        this.AddPage("/view/:Id/started", new Started());
        this.AddPage("/view/:Id/update", new Update());
        this.AddPage("/view/:Id", new View());
    }
}