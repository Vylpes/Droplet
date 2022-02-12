import { Column, Entity, getConnection, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus } from "../constants/ItemStatus";
import { ListingStatus } from "../constants/ListingStatus";
import BaseEntity from "../contracts/BaseEntity";
import { Item } from "./Item";
import { ItemPurchase } from "./ItemPurchase";
import { Order } from "./Order";

@Entity()
export class Listing extends BaseEntity {
    constructor(name: string, listingNumber: string, price: number, endDate: Date) {
        super();

        this.Name = name;
        this.ListingNumber = listingNumber;
        this.Price = price;
        this.EndDate = endDate;

        this.Status = ListingStatus.Active;
        this.RelistedTimes = 0;
    }

    @Column()
    Name: string;

    @Column()
    ListingNumber: string;

    @Column("decimal", { precision: 20, scale: 2 })
    Price: number;

    @Column()
    Status: ListingStatus;

    @Column()
    EndDate: Date;

    @Column()
    RelistedTimes: number;

    @ManyToMany(() => Item)
    @JoinTable()
    Items: Item[];

    @ManyToMany(() => Order)
    @JoinTable()
    Orders: Order[];

    public UpdateBasicDetails(name: string, listingNumber: string, price: number) {
        this.Name = name;
        this.ListingNumber = listingNumber;
        this.Price = price;

        this.WhenUpdated = new Date();
    }

    public MarkAsSold() {
        this.Status = ListingStatus.Sold;

        this.WhenUpdated = new Date();
    }

    public MarkAsUnsold() {
        this.Status = ListingStatus.Unsold;

        this.WhenUpdated = new Date();
    }

    public RenewListing(endDate: Date) {
        this.EndDate = endDate;
        this.RelistedTimes++;

        this.WhenUpdated = new Date();
    }

    public AddItemToListing(item: Item) {
        this.Items.push(item);
    }
}