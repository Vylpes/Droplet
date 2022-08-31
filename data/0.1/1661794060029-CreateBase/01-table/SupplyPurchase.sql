CREATE TABLE `supply_purchase` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Status` int NOT NULL,
  `Price` decimal(20,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;