const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Attack", async () => {
  it("Should empty the balance of good contract", async () => {
    const goodContractFactory = await ethers.getContractFactory("GoodContract");
    const goodContract = await goodContractFactory.deploy();
    await goodContract.deployed();

    const badContractFactory = await ethers.getContractFactory("BadContract");
    const badContract = await badContractFactory.deploy(goodContract.address);
    await badContract.deployed();

    const [_, innocentAddress, attackerAddress] = await ethers.getSigners();

    let tx = await goodContract.connect(innocentAddress).addBalance({
      value: parseEther("10"),
    });
    await tx.wait();

    let balanceEth = await ethers.provider.getBalance(goodContract.address);
    console.log("Balance ETH: ", balanceEth);
    expect(balanceEth).to.equal(parseEther("10"));

    tx = await badContract
      .connect(attackerAddress)
      .attack({ value: parseEther("1") });
    await tx.wait();

    balanceEth = await ethers.provider.getBalance(goodContract.address);
    console.log("GoodContract Balance: ", balanceEth);
    expect(balanceEth).to.equal(BigNumber.from("0"));

    balanceEth = await ethers.provider.getBalance(badContract.address);
    console.log("BadContract Balance: ", balanceEth);
    expect(balanceEth).to.equal(parseEther("11"));
  });
});
