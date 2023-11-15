import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { ListingStatus, ListingStatusNames } from "../../constants/Status/ListingStatus";
import BaseEntity from "../../contracts/BaseEntity";
import { Item } from "./Item";
import { Order } from "./Order";
import PostagePolicy from "./PostagePolicy";
import { ListingItem } from "./ListingItem";
import { OrderListing } from "./OrderListing";

@Entity()
export class Listing extends BaseEntity {
    constructor(name: string, listingNumber: string, price: number, endDate: Date, quantity: number) {
        super();

        this.Name = name;
        this.ListingNumber = listingNumber;
        this.Price = price;
        this.EndDate = endDate;
        this.Quantity = quantity;

        this.Status = ListingStatus.Active;
        this.RelistedTimes = 0;
        this.OriginalQuantity = this.Quantity;
    }

    @Column()
    Name: string;

    @Column()
    ListingNumber: string;

    @Column("decimal", { precision: 20, scale: 2 })
    Price: number;

    @Column()
    Status: ListingStatus;

    StatusName = () => ListingStatusNames.get(this.Status);

    @Column()
    EndDate: Date;

    @Column()
    RelistedTimes: number;

    @Column()
    Quantity: number;

    @Column()
    OriginalQuantity: number;

    @OneToMany(() => ListingItem, x => x.Listing)
    Items: ListingItem[];

    @OneToMany(() => OrderListing, x => x.Listing)
    Orders: OrderListing[];

    @ManyToOne(() => PostagePolicy, policy => policy.Listings)
    PostagePolicy: PostagePolicy;

    public UpdateBasicDetails(name: string, listingNumber: string, price: number, quantity: number) {
        this.Name = name;
        this.ListingNumber = listingNumber;
        this.Price = price;
        this.Quantity = quantity;
        this.OriginalQuantity = quantity;

        this.WhenUpdated = new Date();
    }

    public MarkAsSold(amount: number) {
        if (amount > this.Quantity) return;

        this.Quantity = Number(this.Quantity) - Number(amount);

        if (this.Quantity == 0) {
            this.Status = ListingStatus.Sold;
        }

        this.WhenUpdated = new Date();
    }

    public MarkAsUnsold() {
        this.Status = ListingStatus.Unsold;
        this.Quantity = this.OriginalQuantity;

        this.WhenUpdated = new Date();
    }

    public RenewListing(endDate: Date) {
        this.EndDate = endDate;
        this.RelistedTimes++;

        this.WhenUpdated = new Date();
    }

    public AddItemToListing(listingItem: ListingItem) {
        this.Items.push(listingItem);
    }

    public AddPostagePolicyToListing(policy: PostagePolicy) {
        this.PostagePolicy = policy;
    }
}