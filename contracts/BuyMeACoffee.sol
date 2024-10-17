// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BuyMeACoffee {
    address payable owner;

    event NewCoffee(address indexed from, uint256 timestamp, string message);

    struct Coffee {
        address from;
        uint256 timestamp;
        string message;
    }

    Coffee[] coffees;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(string memory _message) public payable {
        require(msg.value > 0, "Can't buy coffee with 0 ETH");

        // Add the coffee to storage
        coffees.push(Coffee(msg.sender, block.timestamp, _message));

        // Emit the event
        emit NewCoffee(msg.sender, block.timestamp, _message);

        // Transfer the ETH to the owner
        owner.transfer(msg.value);
    }

    function getCoffees() public view returns (Coffee[] memory) {
        return coffees;
    }
}
