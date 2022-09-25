// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/*
* @author Dovydas Lapinskas - https://dovydas.io
*/
contract TreasureFactory {
    
    /*
    *   Storage
    */

    address public factoryAddress;
    address[] public hiders;
    uint public treasureContractsCount;
    Treasure[] public treasureContracts;
    UserActivity[] public activities;
    mapping(address => UserActivity) public activity;
    mapping(address => bool) public isHider;

    struct UserActivity {
        address user;
        address contractAddress;
        int8 side;
        uint timestamp;
    }

    /*
    * Construct
    */
    
    // @notice Address of contract stored.
    constructor() {
        factoryAddress = address(this);
    }

    /*
    *  Functions
    */

    // @notice Create Treasure contract with initial data.
    function createTreasure(string memory _title, string memory _hint, string memory _latitude, string memory _longitude) public {
        Treasure treasure = new Treasure(_title, _hint, _latitude, _longitude, payable(msg.sender), factoryAddress);
        treasureContracts.push(treasure);
        treasureContractsCount++;

        if (!isHider[msg.sender]) {
            isHider[msg.sender] = true;
            hiders.push(msg.sender);
        }
    }

    // @return Array of unique users who have hidden a treasure.
    function getAllHiders() public view returns (address[] memory) {
        return hiders;
    }

    // @return Array of treasure contracts.
    function getTreasureContracts() public view returns (Treasure[] memory) {
        return treasureContracts;
    }

    // @return Array of user activity structs.
    function getUsersActivity() public view returns (UserActivity[] memory) {
        return activities;
    }

    // @notice Adds user activity for activity side (hidden or located).
    function addActivity(address _creator, address _treasureAddress, int8 _side) external {
        activity[_creator] = UserActivity(_creator, _treasureAddress, _side, block.timestamp);
        activities.push(activity[_creator]);
    }

    // @notice Removes treasure.
    function removeTreasure(address _treasureAddress) external {
        Treasure[] storage treasures = treasureContracts;
        /*
        *  @notice Loop through all treasure contracts to find the passed treasure.
        *  @notice Move matched treasure to last array element and remove with .pop()
        */
        for(uint i = 0; i < treasures.length - 1; i++) {
            if( treasures[i] == Treasure(_treasureAddress) ) {
                treasures[i] = treasures[treasures.length -1];
                treasures.pop();
            }
        }
    }
}

contract Treasure {

    /*
    *   Storage
    */

    string title;
    string hint;
    string latitude;
    string longitude;
    uint timestamp;
    uint public locatedCount;
    address public factoryAddress;
    address public treasureAddress;
    address payable public creator;
    FounderActivity[] public finders;
    mapping(address => bool) located;
    mapping(address => uint) public whenLocated;
    mapping(address => FounderActivity) public finder;

    struct FounderActivity {
        address user;
        uint timestamp;
    }

    /*
    * Construct
    */

    // @notice Sets initial treasure data passed from factory contract.
    constructor(string memory _title, string memory _hint, string memory _latitude, string memory _longitude, address payable _creator, address _factoryAddress) {
        treasureAddress = address(this);
        creator = _creator;
        title = _title;
        hint = _hint;
        latitude = _latitude;
        longitude = _longitude;
        timestamp = block.timestamp;
        factoryAddress = _factoryAddress;

        TreasureFactory(factoryAddress).addActivity(creator, treasureAddress, 0);
    }

    // @notice Mark treasure as located.
    function locateTreasure() public {
        require(!located[msg.sender]);
        require(creator != msg.sender);

        finder[msg.sender] = FounderActivity(msg.sender, block.timestamp);
        finders.push(finder[msg.sender]);
        located[msg.sender] = true;
        locatedCount++;
        whenLocated[msg.sender] = block.timestamp;
        TreasureFactory(factoryAddress).addActivity(msg.sender, treasureAddress, 1);
    }

    // @notice Get summarized treasure data with one function call.
    function getTreasureSummary() public view returns (address, address, string memory, string memory, uint, string memory, string memory, uint, FounderActivity[] memory) {
        return (
            treasureAddress,
            creator,
            title,
            hint,
            timestamp,
            latitude,
            longitude,
            locatedCount,
            finders
        );
    }
    
    // @notice Creator of treasure can call function to remove treasure.
    function remove() onlyCreator() public {
        TreasureFactory(factoryAddress).removeTreasure(treasureAddress);
        selfdestruct(creator);
    }

    /*
    *   Modifiers
    */

    modifier onlyCreator() {
        require(msg.sender == creator, 'only creator');
        _;
    }

}