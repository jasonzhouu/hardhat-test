// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

/// @title SimpleBank
/// @author Jason Zhou

contract SimpleBank {
    mapping(address => uint) private balances;

    address public owner;

    event LogDepositMade(address accountAddress, uint amount);

    constructor() public {
        owner = msg.sender;
    }

    /// @notice deposit ether into bank
    /// @return the balance of the user after the deposit is made
    function deposit() public payable returns (uint) {
        // Use 'require' to test user inputs, 'assert' for internal invariants
        // making sure that there isn't an overflow issue
        require((balances[msg.sender] + msg.value) >= balances[msg.sender]);

        balances[msg.sender] += msg.value;

        emit LogDepositMade(msg.sender, msg.value);

        return balances[msg.sender];
    }

    /// @notice withdraw ether from bank
    /// @dev this does not send any excess ether to it
    /// @param withdrawAmount amount you want to withdraw
    /// @return remainingBalance
    function withdraw(uint withdrawAmount)
        public
        returns (uint remainingBalance)
    {
        require(withdrawAmount <= balances[msg.sender]);
        balances[msg.sender] -= withdrawAmount;
        msg.sender.transfer(withdrawAmount);
        return balances[msg.sender];
    }

    /// @notice get balance
    /// @return remaingBalance
    function balance() public view returns (uint remaingBalance) {
        return balances[msg.sender];
    }
}