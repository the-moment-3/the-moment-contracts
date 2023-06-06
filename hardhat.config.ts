import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const {
  PROD_API_URL,
  PROD_PRIVATE_KEY,
  TEST_API_URL,
  TEST_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
} = process.env;

export default {
  defaultNetwork: "goerli",
  networks: {
    mainnet: {
      url: PROD_API_URL,
      accounts: PROD_PRIVATE_KEY ? [PROD_PRIVATE_KEY] : [],
    },
    goerli: {
      url: TEST_API_URL,
      accounts: TEST_PRIVATE_KEY ? [TEST_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  solidity: {
    version: "0.8.8",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
} as HardhatUserConfig;
