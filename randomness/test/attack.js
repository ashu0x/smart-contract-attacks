const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Attack", () => {
  it("Should be able to attack the contract", async () => {
    const gameFactory = await ethers.getContractFactory("Game");
    const game = await gameFactory.deploy({
      value: ethers.utils.parseEther("0.1"),
    });
    await game.deployed();
    console.log("Game Deployed address: ", game.address);

    const balanceb = await game.getBalance();
    console.log("Balance before the attack: ", balanceb);

    const attackFactory = await ethers.getContractFactory("Attack");
    const attack = await attackFactory.deploy(game.address);
    await attack.deployed();
    console.log("Attack Deployed address: ", attack.address);

    const txn = await attack.attack();
    await txn.wait();

    const balance = await game.getBalance();
    console.log("After attack Balance: ", balance);
    expect(balance).to.equal("0");

    const attackerBalance = await attackFactory.signer.provider.getBalance(
      attack.address
    );
    console.log("Attacker Balance: ", attackFactory);
    console.log("Attacker Balance: ", attackerBalance);
  });
});
