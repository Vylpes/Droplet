CREATE TABLE `storage` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `Name` varchar(255) NOT NULL,
  `SkuPrefix` varchar(255) NOT NULL,
  `StorageType` int NOT NULL,
  `ItemCounter` int NOT NULL,
  `parentId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;