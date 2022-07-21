// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fundraiser {
    string public name;
    string public url;
    string public imageURL;
    string public description;

    address payable public beneficient;
    address public custodian;

    constructor(
        string memory _name,
        string memory _url,
        string memory _imageURL,
        string memory _description,
        address payable _beneficient,
        address payable _custodian
    ) {
        name = _name;
        url = _url;
        imageURL = _imageURL;
        description = _description;
        beneficient = _beneficient;
        custodian = _custodian;
    }
}
