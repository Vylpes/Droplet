ALTER TABLE `item`
  ADD CONSTRAINT `FK_459631ed942c6e453c5d7f330cc` FOREIGN KEY (`storageId`) REFERENCES `storage` (`Id`),
  ADD CONSTRAINT `FK_4ef1c1b2de1289ac20473aa9dd7` FOREIGN KEY (`purchaseId`) REFERENCES `item_purchase` (`Id`);