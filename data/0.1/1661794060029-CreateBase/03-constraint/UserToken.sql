ALTER TABLE `user_token`
  ADD CONSTRAINT `FK_d37db50eecdf9b8ce4eedd2f918` FOREIGN KEY (`userId`) REFERENCES `user` (`Id`);