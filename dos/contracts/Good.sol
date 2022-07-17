// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Good{
    address public currentWinner;
    uint public currentAuctionPrice;

    constructor(){
        currentWinner = msg.sender;
    }

    function setCurrentAuctionPrice() public payable{
        require(msg.value > currentAuctionPrice, "Price should be greater than current price.");
        (bool success, ) = currentWinner.call{value: currentAuctionPrice}("");
        if(success){
            currentAuctionPrice = msg.value;
            currentWinner = msg.sender;
        }
    }


}