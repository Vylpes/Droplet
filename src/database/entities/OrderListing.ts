import { Column, Entity, ManyToOne } from "typeorm";
import BaseEntity from "../../contracts/BaseEntity";
import { Listing } from "./Listing";
import { Order } from "./Order";

@Entity()
export class OrderListing extends BaseEntity {
    constructor(quantity: number) {
        super();

        this.Quantity = quantity;
    }

    @Column()
    Quantity: number;

    @ManyToOne(() => Listing, x => x.Orders)
    Listing: Listing;

    @ManyToOne(() => Order, x => x.Listings)
    Order: Order;

    public EditBasicDetails(quantity: number) {
        this.Quantity = quantity;
    }

    public AssignListing(listing: Listing) {
        if (this.Listing) return;

        this.Listing = listing;
    }

    public AssignOrder(order: Order) {
        if (this.Order) return;

        this.Order = order;
    }
}