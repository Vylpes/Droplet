ALTER TABLE `supply`
  ADD CONSTRAINT `FK_d22ae2fba4866e94183e148413d` FOREIGN KEY (`purchaseId`) REFERENCES `supply_purchase` (`Id`);