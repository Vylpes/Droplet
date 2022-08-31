CREATE TABLE `user_token` (
  `Id` varchar(255) NOT NULL,
  `WhenCreated` datetime NOT NULL,
  `WhenUpdated` datetime NOT NULL,
  `Token` varchar(255) NOT NULL,
  `Expires` datetime NOT NULL,
  `Type` int NOT NULL,
  `userId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;