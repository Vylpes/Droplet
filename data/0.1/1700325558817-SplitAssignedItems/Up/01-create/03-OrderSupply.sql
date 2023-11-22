CREATE TABLE order_supply (
    Id varchar(255) NOT NULL,
    WhenCreated datetime NOT NULL,
    WhenUpdated datetime NOT NULL,
    Quantity int NOT NULL,
    supplyId varchar(255) DEFAULT NULL,
    orderId varchar(255) DEFAULT NULL
);