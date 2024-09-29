import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("NFTMarket", function () {
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

    return { marketContract, collectionContract, owner, otherAccount };
  }

  it("Should fetch items", async function () {
    const { marketContract, collectionContract, owner, otherAccount } = await loadFixture(deployFixture);
    await collectionContract.mint("https://<gateway>/ipfs/<CID>");
    const listingPrice = await marketContract.listingPrice();
    const auctionPrice = ethers.parseUnits("1", "ether");
    await marketContract.createMarketItem(collectionContract.getAddress(), 1, auctionPrice, { value: listingPrice });
    const marketItems = await marketContract.fetchMarketItems();

    expect(marketItems.length).to.equal(1);
  });

  it("Should fetch my items", async function () {
    const { marketContract, collectionContract, owner, otherAccount } = await loadFixture(deployFixture);    

    const listingPrice = await marketContract.listingPrice();
    const auctionPrice = ethers.parseUnits("1", "ether");

    await collectionContract.mint("https://<gateway>/ipfs/1");
    await collectionContract.mint("https://<gateway>/ipfs/2");

    await marketContract.createMarketItem(collectionContract.getAddress(), 1, auctionPrice, { value: listingPrice });
    await marketContract.createMarketItem(collectionContract.getAddress(), 2, auctionPrice, { value: listingPrice });

    const instance = marketContract.connect(otherAccount);
    await instance.createMarketSale(collectionContract.getAddress(), 2, { value: auctionPrice });

    const myNFTs = await instance.fetchMyOwnedItems();

    expect(myNFTs.length).to.equal(1);
    expect(myNFTs[0].itemId).to.equal(2);
  });

  it("Should fetch my created items", async function () {
    const { marketContract, collectionContract, owner, otherAccount } = await loadFixture(deployFixture);    

    const listingPrice = await marketContract.listingPrice();
    const auctionPrice = ethers.parseUnits("1", "ether");

    await collectionContract.mint("https://<gateway>/ipfs/1");
    await collectionContract.mint("https://<gateway>/ipfs/2");

    await marketContract.createMarketItem(collectionContract.getAddress(), 1, auctionPrice, { value: listingPrice });
    await marketContract.createMarketItem(collectionContract.getAddress(), 2, auctionPrice, { value: listingPrice });      

    const items = await marketContract.fetchMyCreatedItems();
    
    expect(items.length).to.equal(2);
  });

  it("Should create and execute market sale", async function () {
    const { marketContract, collectionContract, owner, otherAccount } = await loadFixture(deployFixture);    

    const listingPrice = await marketContract.listingPrice();
    const auctionPrice = ethers.parseUnits("1", "ether");

    await collectionContract.mint("https://<gateway>/ipfs/1");
    await marketContract.createMarketItem(collectionContract.getAddress(), 1, auctionPrice, { value: listingPrice });    

    const instance = marketContract.connect(otherAccount);
    await instance.createMarketSale(collectionContract.getAddress(), 1, { value: auctionPrice });

    const nftOwner = await collectionContract.ownerOf(1);
    const marketItems = await marketContract.fetchMarketItems();

    expect(nftOwner).to.equal(otherAccount.address);
    expect(marketItems.length).to.equal(0);
  });

  

});