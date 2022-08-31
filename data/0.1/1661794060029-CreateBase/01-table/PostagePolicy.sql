CREATE TABLE `postage_policy` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `Name` varchar(255) NOT NULL,
  `CostToBuyer` decimal(20,2) NOT NULL,
  `ActualCost` decimal(20,2) NOT NULL,
  `Archived` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;