import ApiRoute from "../../../contracts/ApiRoute";
import AddNote from "./addNote";
import AssignItem from "./assignItem";
import AssignPostagePolicy from "./assignPostagePolicy";
import End from "./end";
import List from "./list";
import New from "./new";
import Renew from "./renew";
import Update from "./update";
import View from "./view";

export default class ListingsRouter extends ApiRoute {
    constructor() {
        super(true);

        this.AddPage("/:Id/add-note", new AddNote());
        this.AddPage("/view/:Id/assign-item", new AssignItem());
        this.AddPage("/view/:Id/assign-postage-policy", new AssignPostagePolicy());
        this.AddPage("/view/:Id/end", new End());
        this.AddPage("/new", new New());
        this.AddPage("/view/:Id/renew", new Renew());
        this.AddPage("/view/:Id/update", new Update());
        this.AddPage("/view/:Id", new View());
        this.AddPage("/:status", new List());
    }
}
