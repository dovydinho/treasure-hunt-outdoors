const TreasureFactoryMigration = artifacts.require("TreasureFactory");

module.exports = function (deployer) {
    deployer.deploy(TreasureFactoryMigration);
};
