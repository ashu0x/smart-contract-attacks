const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Attack", () => {
  it("Good Attack", async () => {
    const goodContractFactory = await ethers.getContractFactory("Good");
    const goodContract = await goodContractFactory.deploy();
    await goodContract.deployed();
    console.log("Good Contract deployed to: ", goodContract.address);

    const attackContractFactory = await ethers.getContractFactory("Attack");
    const attackContract = await attackContractFactory.deploy(
      goodContract.address
    );
    await attackContract.deployed();
    console.log("Attack Contract deployed to: ", attackContract.address);
    console.log("Winner 1", await goodContract.currentWinner());

    const [add1, add2] = await ethers.getSigners();
    console.log("Accounts: ", add1.address, " ", add2.address);
    let txn = await goodContract.connect(add1).setCurrentAuctionPrice({
      value: ethers.utils.parseEther("1"),
    });
    await txn.wait();
    console.log("Winner 2", await goodContract.currentWinner());

    txn = await attackContract.attack({
      value: ethers.utils.parseEther("2"),
    });
    await txn.wait();
    console.log("Winner 3", await goodContract.currentWinner());

    txn = await goodContract.connect(add2).setCurrentAuctionPrice({
      value: ethers.utils.parseEther("4"),
    });
    await txn.wait();
    console.log("Winner 4", await goodContract.currentWinner());

    expect(await goodContract.currentWinner()).to.equal(attackContract.address);
  });
});
