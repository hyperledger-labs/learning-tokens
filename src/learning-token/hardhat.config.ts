// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";

// const config: HardhatUserConfig = {
//   solidity: "0.8.18",
// };

// export default config;

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();
const {
  RPC_URL_BESU,
  SUPER_ADMIN_PRI_KEY,
  SEPOLIA_PRIV_KEY,
  SEPOLIA_RPC_URL,
  SEPOLIA_API_KEY,
  POLYGON_RPC_URL,
  POLYGON_API_KEY,
  POLYGON_PRIV_KEY

}: any = process.env;
const config: HardhatUserConfig = {
  networks: {
    // localhost: {
    //   url: "http://localhost:8545", // Replace with your local Hardhat node URL
    //   chainId: 31337, // Replace with the chain ID of your local Hardhat network
    // },
    // besu: {
    //   accounts: [SUPER_ADMIN_PRI_KEY],
    //   url: "http://localhost:8545",
    //   chainId: 1337,
    //   gasPrice: 0,
    //   blockGasLimit: 8000000000,
    //   timeout: 1800000,
    // },
    // sepolia: {
    //   url: SEPOLIA_RPC_URL,
    //   chainId: 11155111,
    //   accounts: [SEPOLIA_PRIV_KEY],
    //   // gasPrice: 80000000, // adjust as necessary
    //   // gas: 124500 // adjust as necessary
    // },
    // mumbai: {
    //   url: POLYGON_RPC_URL,
    //   chainId: 80001,
    //   accounts: [POLYGON_PRIV_KEY],
    //   // gasPrice: 80000000, // adjust as necessary
    //   // gas: 124500 // adjust as necessary
    // },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  etherscan: {
    apiKey: POLYGON_API_KEY,
    //   constructorArguments: [owners, numConfirmationsRequired],
  },
};

export default config;
