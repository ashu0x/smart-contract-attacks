const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Attack", async () => {
  it("Should change the owner of the contract", async () => {
    const helperContractFactory = await ethers.getContractFactory("Helper");
    const helperContract = await helperContractFactory.deploy();
    await helperContract.deployed();
    console.log("Helper Contract Address: ", helperContract.address);

    const goodContractFactory = await ethers.getContractFactory("Good");
    const goodContract = await goodContractFactory.deploy(
      helperContract.address
    );
    await goodContract.deployed();
    console.log("Good Contract Address: ", goodContract.address);

    const attackContractFactory = await ethers.getContractFactory("Attack");
    const attackContract = await attackContractFactory.deploy(
      goodContract.address
    );
    await attackContract.deployed();
    console.log("Attack Contract Address: ", attackContract.address);

    const tx = await attackContract.attack();
    await tx.wait();

    expect(await goodContract.owner()).to.equal(attackContract.address);
  });
});
