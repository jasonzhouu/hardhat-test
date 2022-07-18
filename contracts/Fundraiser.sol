// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fundraiser {
    string public name;
    string public url;
    constructor(string memory _name, string memory _url) {
      name = _name;
      url = _url;
    }
}