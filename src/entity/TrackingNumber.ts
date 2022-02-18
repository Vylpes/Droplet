import { Column, Entity, getConnection, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { PostalService } from "../constants/PostalService";
import { ItemStatus } from "../constants/Status/ItemStatus";
import { TrackingNumberType } from "../constants/TrackingNumberType";
import BaseEntity from "../contracts/BaseEntity";
import { ItemPurchase } from "./ItemPurchase";
import { Listing } from "./Listing";
import { Order } from "./Order";
import { Return } from "./Return";

@Entity()
export class TrackingNumber extends BaseEntity {
    constructor(number: string, service: PostalService, type: TrackingNumberType) {
        super();

        this.Number = number;
        this.Service = service;
        this.Type = type;
    }

    @Column()
    Number: string;

    @Column()
    Service: PostalService;

    @Column()
    Type: TrackingNumberType;

    @ManyToOne(_ => Order, order => order.TrackingNumbers)
    Order: Order;

    @ManyToOne(() => Return, ret => ret.TrackingNumbers)
    Return: Return;

    public EditBasicDetails(number: string, service: PostalService) {
        this.Number = number;
        this.Service = service;

        this.WhenUpdated = new Date();
    }
}