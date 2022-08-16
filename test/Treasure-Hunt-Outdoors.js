const {
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
  
const Treasure = artifacts.require("Treasure")
const TreasureFactory = artifacts.require("TreasureFactory")

contract ("TreasureFactory", (accounts) => {
    let treasureFactory;
    
    beforeEach(async () => {
        treasureFactory = await TreasureFactory.new();
    });

    it("should add creator to hiders array ONLY IF not added yet", async () => {
        const contractCall1 = await treasureFactory.createTreasure("title1", "hint2", "44", "55", {from : accounts[0]});
        const contractCall5 = await treasureFactory.createTreasure("title5", "hint2", "44", "55", {from : accounts[0]});
        const contractCall2 = await treasureFactory.createTreasure("title2", "hint2", "44", "55", {from : accounts[1]});
        const contractCall4 = await treasureFactory.createTreasure("title4", "hint2", "44", "55", {from : accounts[0]});
        const contractCall3 = await treasureFactory.createTreasure("title3", "hint2", "44", "55", {from : accounts[2]});
        const callHiders = await treasureFactory.getAllHiders();

        assert(callHiders[0] === accounts[0]);
        assert(callHiders[1] === accounts[1]);
        assert(callHiders[2] === accounts[2]);
    });

    it("should return correct number of hiders", async () => {
        const contractCall1 = await treasureFactory.createTreasure("title1", "hint2", "44", "55", {from : accounts[0]});
        const contractCall5 = await treasureFactory.createTreasure("title5", "hint2", "44", "55", {from : accounts[0]});
        const contractCall2 = await treasureFactory.createTreasure("title2", "hint2", "44", "55", {from : accounts[1]});
        const contractCall4 = await treasureFactory.createTreasure("title4", "hint2", "44", "55", {from : accounts[0]});
        const contractCall3 = await treasureFactory.createTreasure("title3", "hint2", "44", "55", {from : accounts[2]});
        const callHiders = await treasureFactory.getAllHiders();

        assert(callHiders.length === 3);
    });

    it("should return correct number of treasures", async () => {
        const contractCall1 = await treasureFactory.createTreasure("title1", "hint2", "44", "55", {from : accounts[0]});
        const contractCall2 = await treasureFactory.createTreasure("title2", "hint2", "44", "55", {from : accounts[1]});
        const contractCall3 = await treasureFactory.createTreasure("title3", "hint2", "44", "55", {from : accounts[2]});
        const contractCall4 = await treasureFactory.createTreasure("title4", "hint2", "44", "55", {from : accounts[0]});
        const contractCall5 = await treasureFactory.createTreasure("title5", "hint2", "44", "55", {from : accounts[0]});
        const callContractsCount = await treasureFactory.getTreasureContracts();

        assert(callContractsCount.length === 5);

    });

    it("should NOT add creator to hiders array if already added", async () => {
        const contractCall1 = await treasureFactory.createTreasure("title1", "hint2", "44", "55", {from : accounts[0]});
        const contractCall5 = await treasureFactory.createTreasure("title5", "hint2", "44", "55", {from : accounts[0]});
        const contractCall2 = await treasureFactory.createTreasure("title2", "hint2", "44", "55", {from : accounts[1]});
        const callHiders = await treasureFactory.getAllHiders();

        assert(callHiders[0] === accounts[0]);
        assert(callHiders[1] != accounts[0]);
    });

});

contract ("Treasure", (accounts) => {
    let treasureFactory;
    let factoryAddress;
    let treasure;

    beforeEach(async () => {
        treasureFactory = await TreasureFactory.new()
        factoryAddress = await treasureFactory.factoryAddress.call();
    });

    it("should have correct initial data", async () => {
        treasure = await Treasure.new("title1", "hint1", "33", "44", accounts[0], factoryAddress);
        const data = await treasure.getTreasureSummary();

        assert(data[1] === accounts[0]);
        assert(data[2] === "title1");
        assert(data[3] === "hint1");
        assert(data[5] === "33");
        assert(data[6] === "44");
    });

    it("should add activity to factory contract when treasure is created", async () => {
        treasure1 = await Treasure.new("title1", "hint1", "33", "44", accounts[0], factoryAddress);
        treasure2 = await Treasure.new("title2", "hint2", "3", "4", accounts[1], factoryAddress);
        treasureAddress1 = await treasure1.treasureAddress.call();
        treasureAddress2 = await treasure2.treasureAddress.call();

        const activity = await treasureFactory.getUsersActivity();

        assert(activity[0][0] === accounts[0]);
        assert(activity[0][1] === treasureAddress1);
        assert(activity[0][2] === "0");

        assert(activity[1][0] === accounts[1]);
        assert(activity[1][1] === treasureAddress2);
        assert(activity[1][2] === "0");
    });

    it("should locate treasure", async () => {
        treasure = await Treasure.new("title1", "hint1", "33", "44", accounts[0], factoryAddress);
        const locate = await treasure.locateTreasure({from : accounts[1]});
        const locatedCount = await treasure.locatedCount.call();

        assert(locatedCount.toString() === "1");
    });
    
    it("should add activity to factory contract after treasure is located", async () => {
        treasure = await Treasure.new("title1", "hint1", "33", "44", accounts[0], factoryAddress);
        treasureAddress = await treasure.treasureAddress.call();
        const locate = await treasure.locateTreasure({from : accounts[1]});
        const activity = await treasureFactory.getUsersActivity();

        assert(activity[1][0] === accounts[1]);
        assert(activity[1][1] === treasureAddress);
        assert(activity[1][2] === "1");
    });

    it("should NOT locate treasure if locator is creator of treasure", async () => {
        treasure = await Treasure.new("title1", "hint1", "33", "44", accounts[0], factoryAddress);
        const locate = await expectRevert(
            treasure.locateTreasure({from : accounts[0]}), 
            'revert'
        );
        const locatedCount = await treasure.locatedCount.call();

        assert(locatedCount.toString() === "0");
    });

    it("should NOT locate treasure if locator has already located treasure", async () => {
        treasure = await Treasure.new("title1", "hint1", "33", "44", accounts[0], factoryAddress);
        const locate1 = await treasure.locateTreasure({from : accounts[1]});
        const locate2 = await expectRevert(
            treasure.locateTreasure({from : accounts[1]}), 
            'revert'
        );
        const locatedCount = await treasure.locatedCount.call();

        assert(locatedCount.toString() === "1");
    });
    
});