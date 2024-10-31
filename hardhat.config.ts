import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-ethers"
import "dotenv/config"
import "hardhat-contract-sizer"
import "./scripts/generate"
import "./scripts/deploy"
import "./scripts/populate"
import { HardhatUserConfig } from "hardhat/config"

const accounts = process.env.PRIVATE_KEY && process.env.OTHER_PRIVATE_KEY ? [process.env.PRIVATE_KEY, process.env.OTHER_PRIVATE_KEY] : process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : undefined

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.27" }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    sapphire: {
      url: "https://sapphire.oasis.io",
      accounts,
      chainId: 0x5afe,
    },
    'sapphire-testnet': {
      url: "https://testnet.sapphire.oasis.io",
      accounts,
      chainId: 0x5aff,
    },
    'sapphire-localnet': {
      url: "http://localhost:8545",
      accounts,
      chainId: 0x5afd,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  mocha: {
    timeout: 20000,
  },
  sourcify: {
    enabled: true,
  },
}

export default config
