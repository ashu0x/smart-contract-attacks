// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract GoodContract{
    mapping(address=>uint) public balances;

    function addBalance() public payable {
        balances[msg.sender]+=msg.value; 
    }

    function withdraw() public {
        require(balances[msg.sender]>0, "Insufficient balance");
        (bool sent, )= msg.sender.call{value: balances[msg.sender]}("");
        require(sent, "Tx failed");
        balances[msg.sender]=0;
    }
}