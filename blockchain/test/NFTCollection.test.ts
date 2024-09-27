import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("NFTCollection", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
    const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");

    const marketContract = await NFTMarket.deploy();
    const collectionContract = await NFTCollection.deploy(marketContract.getAddress());

    return { collectionContract, owner, otherAccount, marketAddress: marketContract.getAddress() };
  }

  it("Should set the name and symbol", async function () {
    const { collectionContract } = await loadFixture(deployFixture);
    expect(await collectionContract.name()).to.equal("ProtoOpenSea");
    expect(await collectionContract.symbol()).to.equal("POS");
  });

  it("Should mint", async function () {
    const { collectionContract } = await loadFixture(deployFixture);
    await collectionContract.mint("https://<gateway>/ipfs/<CID>");
    expect(await collectionContract.tokenURI(1)).to.equal("https://<gateway>/ipfs/<CID>");
  });

  it("Can change approval", async function () {
    const { collectionContract, owner, otherAccount } = await loadFixture(deployFixture);
    const instance = collectionContract.connect(otherAccount);    
    await instance.mint("https://<gateway>/ipfs/<CID>");
    await instance.setApprovalForAll(owner.address, false);    
    expect(await collectionContract.isApprovedForAll(otherAccount.address, owner.address)).to.equal(false);
  });

  it("Cannot change approval", async function () {
    const { collectionContract, otherAccount, marketAddress } = await loadFixture(deployFixture);
    const instance = collectionContract.connect(otherAccount);    
    await instance.mint("https://<gateway>/ipfs/<CID>");    
    await expect(instance.setApprovalForAll(marketAddress, false)).to.be.revertedWith("Cannot remove marketplace approval");
  });

});
