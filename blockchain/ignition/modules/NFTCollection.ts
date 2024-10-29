// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const CollectionModule = buildModule("CollectionModule", (m) => {
  const collection = m.contract("NFTCollection", ["0xf7fD7941c9cEc45E4260c5ceb0edC36e8D829a7d"]);
  
  return { collection };
});

export default CollectionModule;

/* MarketModule#NFTMarket - 0xf7fD7941c9cEc45E4260c5ceb0edC36e8D829a7d
CollectionModule#NFTCollection - 0x97C7e95C268e99dA10bC12E0C78cb21ee4839086 */

/* Successfully verified contract NFTCollection on the block explorer.
https://amoy.polygonscan.com/address/0x415e0d34214bd02E01EdDe1b74121067B901150A#code */