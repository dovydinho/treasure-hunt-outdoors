const {
  expectRevert // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const Treasure = artifacts.require('Treasure');
const TreasureFactory = artifacts.require('TreasureFactory');

contract('TreasureFactory', (accounts) => {
  let treasureFactory;

  beforeEach(async () => {
    treasureFactory = await TreasureFactory.new();
  });

  it('should add creator to hiders array ONLY IF not added yet', async () => {
    await treasureFactory.createTreasure('title1', 'hint1', '11', '12', {
      from: accounts[0]
    });
    await treasureFactory.createTreasure('title2', 'hint2', '22', '23', {
      from: accounts[0]
    });
    await treasureFactory.createTreasure('title3', 'hint3', '33', '34', {
      from: accounts[0]
    });
    await treasureFactory.createTreasure('title4', 'hint4', '44', '45', {
      from: accounts[1]
    });
    await treasureFactory.createTreasure('title5', 'hint5', '55', '56', {
      from: accounts[2]
    });
    let callHiders = await treasureFactory.getAllHiders();

    assert(callHiders.length === 3);

    assert(callHiders[0] === accounts[0]);
    assert(callHiders[1] === accounts[1]);
    assert(callHiders[2] === accounts[2]);
  });

  it('should return correct number of hiders', async () => {
    await treasureFactory.createTreasure('title1', 'hint1', '11', '12', {
      from: accounts[0]
    });
    await treasureFactory.createTreasure('title2', 'hint2', '22', '23', {
      from: accounts[1]
    });
    await treasureFactory.createTreasure('title3', 'hint3', '33', '34', {
      from: accounts[0]
    });
    let callHiders = await treasureFactory.getAllHiders();

    assert(callHiders.length === 2);
  });

  it('should return correct number of treasures', async () => {
    await treasureFactory.createTreasure('title1', 'hint1', '11', '12', {
      from: accounts[0]
    });
    await treasureFactory.createTreasure('title2', 'hint2', '22', '23', {
      from: accounts[0]
    });
    await treasureFactory.createTreasure('title3', 'hint3', '33', '34', {
      from: accounts[0]
    });
    await treasureFactory.createTreasure('title4', 'hint4', '44', '45', {
      from: accounts[1]
    });
    await treasureFactory.createTreasure('title5', 'hint5', '55', '56', {
      from: accounts[2]
    });
    let callContractsCount = await treasureFactory.getTreasureContracts();

    assert(callContractsCount.length === 5);
  });

  it('should NOT add creator to hiders array if already added', async () => {
    await treasureFactory.createTreasure('title1', 'hint1', '11', '12', {
      from: accounts[0]
    });
    await treasureFactory.createTreasure('title2', 'hint2', '22', '23', {
      from: accounts[0]
    });
    await treasureFactory.createTreasure('title3', 'hint3', '33', '34', {
      from: accounts[1]
    });
    let callHiders = await treasureFactory.getAllHiders();

    assert(callHiders[0] === accounts[0]);
    assert(callHiders[1] != accounts[0]);
    assert(callHiders[1] === accounts[1]);
  });
});

contract('Treasure', (accounts) => {
  let treasureFactory;
  let factoryAddress;

  beforeEach(async () => {
    treasureFactory = await TreasureFactory.new();
    factoryAddress = await treasureFactory.factoryAddress.call();
  });

  it('should have correct initial data', async () => {
    let treasure = await Treasure.new(
      'title1',
      'hint1',
      '11',
      '12',
      accounts[0],
      factoryAddress
    );
    let data = await treasure.getTreasureSummary();

    assert(data[1] === accounts[0]);
    assert(data[2] === 'title1');
    assert(data[3] === 'hint1');
    assert(data[5] === '11');
    assert(data[6] === '12');
  });

  it('should add activity to factory contract when treasure is created', async () => {
    let treasure1 = await Treasure.new(
      'title1',
      'hint1',
      '11',
      '12',
      accounts[0],
      factoryAddress
    );
    let treasure2 = await Treasure.new(
      'title2',
      'hint2',
      '22',
      '23',
      accounts[1],
      factoryAddress
    );
    let treasureAddress1 = await treasure1.treasureAddress.call();
    let treasureAddress2 = await treasure2.treasureAddress.call();

    let activity = await treasureFactory.getUsersActivity();

    assert(activity[0][0] === accounts[0]);
    assert(activity[0][1] === treasureAddress1);
    assert(activity[0][2] === '0');

    assert(activity[1][0] === accounts[1]);
    assert(activity[1][1] === treasureAddress2);
    assert(activity[1][2] === '0');
  });

  it('should locate treasure and increment located count', async () => {
    let treasure = await Treasure.new(
      'title1',
      'hint1',
      '11',
      '12',
      accounts[0],
      factoryAddress
    );
    await treasure.locateTreasure({ from: accounts[1] });
    let locatedCount = await treasure.locatedCount.call();

    assert(locatedCount.toString() === '1');
  });

  it('should add activity to factory contract after treasure is located', async () => {
    let treasure = await Treasure.new(
      'title1',
      'hint1',
      '11',
      '12',
      accounts[0],
      factoryAddress
    );
    let treasureAddress = await treasure.treasureAddress.call();
    await treasure.locateTreasure({ from: accounts[1] });
    let activity = await treasureFactory.getUsersActivity();

    assert(activity[1][0] === accounts[1]);
    assert(activity[1][1] === treasureAddress);
    assert(activity[1][2] === '1');
  });

  it('should NOT locate treasure if locator is creator of treasure', async () => {
    let treasure = await Treasure.new(
      'title1',
      'hint1',
      '11',
      '12',
      accounts[0],
      factoryAddress
    );
    await expectRevert(
      treasure.locateTreasure({ from: accounts[0] }),
      'revert'
    );
    let locatedCount = await treasure.locatedCount.call();

    assert(locatedCount.toString() === '0');
  });

  it('should NOT locate treasure if locator has already located treasure', async () => {
    let treasure = await Treasure.new(
      'title1',
      'hint1',
      '33',
      '44',
      accounts[0],
      factoryAddress
    );
    await treasure.locateTreasure({ from: accounts[1] });
    await expectRevert(
      treasure.locateTreasure({ from: accounts[1] }),
      'revert'
    );
    let locatedCount = await treasure.locatedCount.call();

    assert(locatedCount.toString() === '1');
  });

  it('should delete treasure contract and remove from treasures list', async () => {
    await treasureFactory.createTreasure('title1', 'hint1', '44', '55', {
      from: accounts[0]
    });
    await treasureFactory.createTreasure('title2', 'hint2', '44', '55', {
      from: accounts[1]
    });
    await treasureFactory.createTreasure('title2', 'hint2', '44', '55', {
      from: accounts[2]
    });
    let getContracts1 = await treasureFactory.getTreasureContracts();

    let treasure1 = await Treasure.at(getContracts1[0]);
    let treasure2 = await Treasure.at(getContracts1[1]);
    let treasure3 = await Treasure.at(getContracts1[2]);

    assert(getContracts1.length === 3);

    await treasure2.remove({ from: accounts[1] });

    let getContracts2 = await treasureFactory.getTreasureContracts();

    assert(getContracts2.length === 2);
  });

  it('should NOT delete treasure if function caller is NOT the creator of treasure', async () => {
    await treasureFactory.createTreasure('title1', 'hint1', '44', '55', {
      from: accounts[0]
    });
    let getContracts = await treasureFactory.getTreasureContracts();
    let treasure = await Treasure.at(getContracts[0]);

    await expectRevert(treasure.remove({ from: accounts[1] }), 'revert');
  });
});
