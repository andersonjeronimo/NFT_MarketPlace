// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const MarketModule = buildModule("MarketModule", (m) => {  
  const market = m.contract("NFTMarket");
  return { market };
});

export default MarketModule;