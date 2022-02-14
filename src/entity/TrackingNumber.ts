import { Column, Entity, getConnection, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { PostalService } from "../constants/PostalService";
import { ItemStatus } from "../constants/Status/ItemStatus";
import BaseEntity from "../contracts/BaseEntity";
import { ItemPurchase } from "./ItemPurchase";
import { Listing } from "./Listing";
import { Order } from "./Order";

@Entity()
export class TrackingNumber extends BaseEntity {
    constructor(number: string, service: PostalService) {
        super();

        this.Number = number;
        this.Service = service;
    }

    @Column()
    Number: string;

    @Column()
    Service: PostalService;

    @ManyToOne(_ => Order, order => order.TrackingNumbers)
    Order: Order;

    public EditBasicDetails(number: string, service: PostalService) {
        this.Number = number;
        this.Service = service;

        this.WhenUpdated = new Date();
    }
}