import { Column, Entity, getConnection, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus } from "../constants/Status/ItemStatus";
import { StorageType } from "../constants/StorageType";
import BaseEntity from "../contracts/BaseEntity";
import { Item } from "./Item";
import { ItemPurchase } from "./ItemPurchase";
import { Listing } from "./Listing";

@Entity()
export class Storage extends BaseEntity {
    constructor(name: string, skuPrefix: string, storageType: StorageType) {
        super();

        this.Name = name;
        this.SkuPrefix = skuPrefix;
        this.StorageType = storageType;
    }

    @Column()
    Name: string;

    @Column()
    SkuPrefix: string;

    @Column()
    StorageType: StorageType;

    @ManyToOne(() => Storage, storage => storage.Children)
    Parent?: Storage;

    @OneToMany(() => Storage, storage => storage.Parent)
    Children: Storage[];

    @OneToMany(() => Item, item => item.Storage)
    Items: Item[];

    public UpdateBasicDetails(name: string, storageType: StorageType) {
        this.Name = name;
        this.StorageType = storageType;
    }

    public AssignParentStorage(parent: Storage) {
        if (this.StorageType == StorageType.Building) return;

        this.Parent = parent;
    }

    public AddItemToBin(item: Item) {
        if (this.StorageType != StorageType.Bin) return;

        this.Items.push(item);
    }
}