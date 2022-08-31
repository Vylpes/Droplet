ALTER TABLE `item`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_4ef1c1b2de1289ac20473aa9dd7` (`purchaseId`),
  ADD KEY `FK_459631ed942c6e453c5d7f330cc` (`storageId`);