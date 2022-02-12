import { Column, Entity, getConnection, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus } from "../constants/ItemStatus";
import { ListingStatus } from "../constants/ListingStatus";
import { OrderStatus } from "../constants/OrderStatus";
import BaseEntity from "../contracts/BaseEntity";
import { Item } from "./Item";
import { ItemPurchase } from "./ItemPurchase";
import { Listing } from "./Listing";
import { Supply } from "./Supply";

@Entity()
export class Order extends BaseEntity {
    constructor(orderNumber: string, offerAccepted: boolean, buyer: string) {
        super();

        this.OrderNumber = orderNumber;
        this.OfferAccepted = offerAccepted;
        this.DispatchBy = new Date();
        this.Buyer = buyer;

        this.Status = OrderStatus.AwaitingPayment;
        this.Price = 0;
    }

    @Column()
    OrderNumber: string;

    @Column("decimal", { precision: 20, scale: 2 })
    Price: number;

    @Column()
    OfferAccepted: boolean;

    @Column()
    Status: OrderStatus;

    @Column()
    DispatchBy: Date;

    @Column()
    Buyer: string;

    @OneToMany(() => Listing, listing => listing.Order)
    Listings: Listing[];

    @OneToMany(() => Supply, supply => supply.Order)
    Supplies: Supply[];

    public UpdateBasicDetails(orderNumber: string, offerAccepted: boolean, buyer: string) {
        this.OrderNumber = orderNumber;
        this.OfferAccepted = offerAccepted;
        this.Buyer = buyer;

        this.WhenUpdated = new Date();
    }

    public UpdateStatus(status: OrderStatus) {
        this.Status = status;

        this.WhenUpdated = new Date();
    }

    public MarkAsPaid() {
        this.Status = OrderStatus.AwaitingDispatch;
        this.DispatchBy = this.CalculateNextWeekday(0);

        this.WhenUpdated = new Date();
    }

    public MarkAsDispatched() {
        this.Status = OrderStatus.Dispatched;

        this.WhenUpdated = new Date();
    }

    public AddListingToOrder(listing: Listing) {
        this.Listings.push(listing);
        this.Price = Number(this.Price) + Number(listing.Price);

        this.WhenUpdated = new Date();
    }

    public AddSupplyToOrder(supply: Supply) {
        this.Supplies.push(supply);

        this.WhenUpdated = new Date();
    }

    public ApplyDiscount(amount: number) {
        if (amount > Number(this.Price)) return;

        this.Price = Number(this.Price) - Number(amount);

        this.WhenUpdated = new Date();
    }

    private CalculateNextWeekday(additionalDays: number): Date {
        const date = new Date();
        const day = date.getDay();

        switch(day) {
            case 5: // Friday
                return new Date(date.getTime() + (1000 * 60 * 60 * 24 * (3 + additionalDays)));
            case 6: // Saturday
                return new Date(date.getTime() + (1000 * 60 * 60 * 24 * (2 + additionalDays)));
            default:
                return new Date(date.getTime() + (1000 * 60 * 60 * 24 * (1 + additionalDays)));
        }
    }
}