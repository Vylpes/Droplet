import { Column, Entity, ManyToOne } from "typeorm";
import BaseEntity from "../../contracts/BaseEntity";
import { Item } from "./Item";
import { Listing } from "./Listing";

@Entity()
export class ListingItem extends BaseEntity {
    constructor(quantity: number) {
        super();

        this.Quantity = quantity;
    }

    @Column()
    Quantity: number;

    QuantityPerSale = () => Math.floor(this.Quantity / this.Listing.Quantity);

    @ManyToOne(() => Item, x => x.Listings)
    Item: Item;

    @ManyToOne(() => Listing, x => x.Items)
    Listing: Listing;

    public EditBasicDetails(quantity: number) {
        this.Quantity = quantity;
    }

    public AssignItem(item: Item) {
        if (this.Item) return;

        this.Item = item;
    }

    public AssignListing(listing: Listing) {
        if (this.Listing) return;

        this.Listing = listing;
    }
}