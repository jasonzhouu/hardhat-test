// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
    string public name;
    string public url;
    string public imageURL;
    string public description;

    address payable public beneficiary;

    struct Donation {
        uint amount;
        uint date;
    }

    mapping(address => Donation[]) private _donations;

    event LogNewDonation(address contributor, uint amount);

    constructor(
        string memory _name,
        string memory _url,
        string memory _imageURL,
        string memory _description,
        address payable _beneficiary,
        address payable _custodian
    ) {
        name = _name;
        url = _url;
        imageURL = _imageURL;
        description = _description;
        beneficiary = _beneficiary;
        _transferOwnership(_custodian);
    }

    function setBeneficiary(address payable _beneficiary) public onlyOwner {
        beneficiary = _beneficiary;
    }

    function donate() public payable {
        Donation memory donation = Donation({
            amount: msg.value,
            date: block.timestamp
        });
        _donations[msg.sender].push(donation);
        // donations.push(
        //     Donation({
        //         amount: msg.value,
        //         contributor: msg.sender,
        //         date: block.timestamp
        //     })
        // );
        beneficiary.transfer(msg.value);
        emit LogNewDonation(msg.sender, msg.value);
    }

    function myDonationsCount() public view returns (uint) {
        return _donations[msg.sender].length;
    }
}
