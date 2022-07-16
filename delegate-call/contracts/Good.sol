// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Good{
    address public helper;
    address public owner;
    uint num;

    constructor(address _helper){
        helper=_helper;
        owner=msg.sender;
    }

    function setNum(uint _num) public {
        helper.delegatecall(abi.encodeWithSignature("setNum(uint256)", _num));
    }

}