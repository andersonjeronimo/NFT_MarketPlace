// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const MarketModule = buildModule("MarketModule", (m) => {
  const market = m.contract("NFTMarket");
    
  return { market };
});

export default MarketModule;

//MarketModule#NFTMarket - 0x44880A72A06977225c9Fee45AE148917510cf22B

/* Successfully verified contract NFTMarket on the block explorer.
https://amoy.polygonscan.com/address/0x44880A72A06977225c9Fee45AE148917510cf22B#code */