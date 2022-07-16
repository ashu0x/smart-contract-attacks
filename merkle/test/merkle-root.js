const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

const encodeLeaf = (address, spots) => {
  return ethers.utils.defaultAbiCoder.encode(
    ["address", "uint64"],
    [address, spots]
  );
};

describe("Check if merkle root is working", () => {
  it("Should be able to verify if a given address is in whitelist or not", async () => {
    const [owner, add1, add2, add3, add4, add5] = await ethers.getSigners();
    const list = [
      encodeLeaf(owner.address, 2),
      encodeLeaf(add1.address, 2),
      encodeLeaf(add2.address, 2),
      encodeLeaf(add3.address, 2),
      encodeLeaf(add4.address, 2),
      encodeLeaf(add5.address, 2),
    ];

    const merkleTree = new MerkleTree(list, keccak256, {
      hashLeaves: true,
      sortPairs: true,
    });

    const root = merkleTree.getHexRoot();

    const whitelist = await ethers.getContractFactory("Whitelist");
    const Whitelist = await whitelist.deploy(root);
    await Whitelist.deployed();

    const leaf = keccak256(list[0]);
    const proof = merkleTree.getHexProof(leaf);
    console.log("Proof", proof);
    console.log("Leaf", leaf);
    let verified = await Whitelist.checkInWhitelist(proof, 2);
    expect(verified).to.equal(true);
    verified = await Whitelist.checkInWhitelist(proof, 3);
    expect(verified).to.equal(false);
    verified = await Whitelist.checkInWhitelist([], 2);
    expect(verified).to.equal(false);
  });
});
