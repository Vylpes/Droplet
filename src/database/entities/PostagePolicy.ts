import { Column, Entity, OneToMany } from "typeorm";
import BaseEntity from "../../contracts/BaseEntity";
import { Listing } from "./Listing";
import { Order } from "./Order";

@Entity()
export default class PostagePolicy extends BaseEntity {
    constructor(name: string, costToBuyer: number, actualCost: number) {
        super();

        this.Name = name;
        this.CostToBuyer = costToBuyer;
        this.ActualCost = actualCost;

        this.Archived = false;
    }

    @Column()
    Name: string;

    @Column("decimal", { precision: 20, scale: 2 })
    CostToBuyer: number;

    @Column("decimal", { precision: 20, scale: 2 })
    ActualCost: number;

    @Column()
    Archived: boolean;

    @OneToMany(() => Order, order => order.PostagePolicy)
    Orders: Order[];

    @OneToMany(() => Listing, listing => listing.PostagePolicy)
    Listings: Listing[];

    public UpdateBasicDetails(name: string, costToBuyer: number, actualCost: number) {
        this.Name = name;
        this.CostToBuyer = costToBuyer;
        this.ActualCost = actualCost;
    }

    public ArchivePolicy() {
        this.Archived = true;
    }
}