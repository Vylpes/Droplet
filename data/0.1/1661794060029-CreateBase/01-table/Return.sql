CREATE TABLE `return` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `ReturnNumber` varchar(255) NOT NULL,
  `RMA` varchar(255) NOT NULL,
  `ReturnBy` datetime NOT NULL,
  `Status` int NOT NULL,
  `RefundAmount` decimal(20,2) NOT NULL,
  `orderId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;