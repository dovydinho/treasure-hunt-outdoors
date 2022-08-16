// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract TreasureFactory {
    address public factoryAddress;
    address[] public hiders;
    Treasure[] public treasureContracts;
    UserActivity[] public activities;
    mapping(address => UserActivity) public activity;
    mapping(address => bool) public isHider;
    uint public treasureContractsCount;

    struct UserActivity {
        address user;
        address contractAddress;
        int8 side;
        uint timestamp;
    }

    constructor() {
        factoryAddress = address(this);
    }

    function createTreasure(string memory _title, string memory _hint, string memory _latitude, string memory _longitude) public {
        Treasure treasure = new Treasure(_title, _hint, _latitude, _longitude, msg.sender, factoryAddress);
        treasureContracts.push(treasure);
        treasureContractsCount++;

        if (!isHider[msg.sender]) {
            isHider[msg.sender] = true;
            hiders.push(msg.sender);
        }
    }
    
    function getAllHiders() public view returns (address[] memory) {
        return hiders;
    }

    function getTreasureContracts() public view returns (Treasure[] memory) {
        return treasureContracts;
    }

    function getUsersActivity() public view returns (UserActivity[] memory) {
        return activities;
    }

    function addActivity(address _creator, address _treasureAddress, int8 _side) external {
        activity[_creator] = UserActivity(_creator, _treasureAddress, _side, block.timestamp);
        activities.push(activity[_creator]);
    }
}

contract Treasure {
    address public factoryAddress;
    address public treasureAddress;
    address public creator;
    string title;
    string hint;
    uint currentTimestamp;
    string latitude;
    string longitude;
    mapping(address => bool) located;
    mapping(address => uint) public whenLocated;
    uint public locatedCount;
    FounderActivity[] public founders;
    mapping(address => FounderActivity) public founder;

    struct FounderActivity {
        address user;
        uint timestamp;
    }

    constructor(string memory _title, string memory _hint, string memory _latitude, string memory _longitude, address _creator, address _factoryAddress) {
        treasureAddress = address(this);
        creator = _creator;
        title = _title;
        hint = _hint;
        latitude = _latitude;
        longitude = _longitude;
        currentTimestamp = block.timestamp;
        factoryAddress = _factoryAddress;

        TreasureFactory(factoryAddress).addActivity(creator, treasureAddress, 0);
    }

    function locateTreasure() public {
        require(!located[msg.sender]);
        require(creator != msg.sender);

        founder[msg.sender] = FounderActivity(msg.sender, block.timestamp);
        founders.push(founder[msg.sender]);
        located[msg.sender] = true;
        locatedCount++;
        whenLocated[msg.sender] = block.timestamp;
        TreasureFactory(factoryAddress).addActivity(msg.sender, treasureAddress, 1);
    }

    function getTreasureSummary() public view returns (address, address, string memory, string memory, uint, string memory, string memory, uint, FounderActivity[] memory) {
        return (
            treasureAddress,
            creator,
            title,
            hint,
            currentTimestamp,
            latitude,
            longitude,
            locatedCount,
            founders
        );
    }
}