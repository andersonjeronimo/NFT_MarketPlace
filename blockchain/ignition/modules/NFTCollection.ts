// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const CollectionModule = buildModule("CollectionModule", (m) => {
  const collection = m.contract("NFTCollection", ["0x44880A72A06977225c9Fee45AE148917510cf22B"]);
  
  return { collection };
});

export default CollectionModule;

/* MarketModule#NFTMarket - 0x44880A72A06977225c9Fee45AE148917510cf22B
CollectionModule#NFTCollection - 0x415e0d34214bd02E01EdDe1b74121067B901150A */

/* Successfully verified contract NFTCollection on the block explorer.
https://amoy.polygonscan.com/address/0x415e0d34214bd02E01EdDe1b74121067B901150A#code */