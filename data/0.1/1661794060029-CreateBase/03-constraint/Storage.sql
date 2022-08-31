ALTER TABLE `storage`
  ADD CONSTRAINT `FK_d15c48b764f20c5eecad44bc06f` FOREIGN KEY (`parentId`) REFERENCES `storage` (`Id`);