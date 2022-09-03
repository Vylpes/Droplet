CREATE TABLE `session` (
    `id` varchar(255) NOT NULL PRIMARY KEY,
    `expiresAt` int NOT NULL,
    `data` varchar(1000) NOT NULL
)