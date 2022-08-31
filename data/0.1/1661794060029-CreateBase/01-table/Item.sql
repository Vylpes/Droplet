CREATE TABLE `item` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Sku` varchar(255) NOT NULL,
  `UnlistedQuantity` int NOT NULL,
  `ListedQuantity` int NOT NULL,
  `SoldQuantity` int NOT NULL,
  `RejectedQuantity` int NOT NULL,
  `Status` int NOT NULL,
  `BuyPrice` decimal(20,2) NOT NULL,
  `purchaseId` varchar(255) DEFAULT NULL,
  `storageId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;