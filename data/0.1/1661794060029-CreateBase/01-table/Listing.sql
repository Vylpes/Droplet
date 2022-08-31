CREATE TABLE `listing` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `Name` varchar(255) NOT NULL,
  `ListingNumber` varchar(255) NOT NULL,
  `Price` decimal(20,2) NOT NULL,
  `Status` int NOT NULL,
  `EndDate` datetime NOT NULL,
  `RelistedTimes` int NOT NULL,
  `Quantity` int NOT NULL,
  `OriginalQuantity` int NOT NULL,
  `postagePolicyId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;