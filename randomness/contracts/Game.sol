// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract Game{
    constructor() payable {}

    function pickACard() public view returns(uint) {
        uint num= uint(keccak256(abi.encodePacked(blockhash(block.number), block.timestamp)));
        return num;
    }

    function guess(uint _guess) public {
        uint num = pickACard();
        if(num == _guess){
            (bool success,) = msg.sender.call{value: 0.1 ether}("");
            require(success,"Insufficient Balance");
        }
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

}