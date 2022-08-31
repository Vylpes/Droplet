CREATE TABLE `tracking_number` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `Number` varchar(255) NOT NULL,
  `Service` int NOT NULL,
  `Type` int NOT NULL,
  `orderId` varchar(255) DEFAULT NULL,
  `returnId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;