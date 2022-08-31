CREATE TABLE `order` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `OrderNumber` varchar(255) NOT NULL,
  `Price` decimal(20,2) NOT NULL,
  `OfferAccepted` tinyint NOT NULL,
  `Status` int NOT NULL,
  `DispatchBy` datetime NOT NULL,
  `Buyer` varchar(255) NOT NULL,
  `postagePolicyId` varchar(255) DEFAULT NULL,
  `returnsId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;