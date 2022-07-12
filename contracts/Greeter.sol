pragma solidity ^0.8.0;

contract Greeter {
    function greet() external pure returns(string memory) {
        return "Hello, World!";
    }
    function setGreeting(string calldata greeting) external {

    }
}
