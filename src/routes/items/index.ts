import { Route } from "../../contracts/Route";
import AddNote from "./addNote";
import New from "./new";
import Update from "./update";
import UpdateQuantity from "./update-quantity";
import View from "./view";

export default class ItemsRouter extends Route {
    constructor() {
        super(true);

        this.AddPage("/:itemId/add-note", new AddNote());
        this.AddPage("/new", new New());
        this.AddPage("/:itemId/update-quantity", new UpdateQuantity());
        this.AddPage("/:itemId/update", new Update());
        this.AddPage("/:itemId", new View());
    }
}