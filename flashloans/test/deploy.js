const hre = require("hardhat");
const { expect, assert } = require("chai");
const { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require("../config");
const { ethers, waffle, artifacts } = require("hardhat");

describe("Deploy FLash Loan", async () => {
  it("should be able to take a flash loan and return it back", async () => {
    const flashLoanExample = await ethers.getContractFactory(
      "FlashLoanExample"
    );

    const _flashLoanExample = await flashLoanExample.deploy(
      POOL_ADDRESS_PROVIDER
    );
    await _flashLoanExample.deployed();

    const BALANCE_DAI = ethers.utils.parseEther("2000");
    console.log("DAI Balance: ", BALANCE_DAI);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });

    const signer = await ethers.getSigner(DAI_WHALE);
    const token = await ethers.getContractAt("IERC20", DAI, signer);
    await token
      .connect(signer)
      .transfer(_flashLoanExample.address, BALANCE_DAI);

    const tx = await _flashLoanExample.createFlashLoan(DAI, 1000);
    await tx.wait();

    const remainingBalance = await token.balanceOf(_flashLoanExample.address);
    console.log("Remaining Balance: ", remainingBalance);
    expect(remainingBalance.lt(BALANCE_DAI)).to.be.true;
  });
});
