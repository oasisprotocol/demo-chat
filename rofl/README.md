# ROFL (Runtime Oracle For Logic) App

ROFL is a decentralized messaging application that manages group memberships based on token holdings. It serves as an off-chain oracle that verifies token balances and automatically manages group memberships.

## Features

- Token-gated group access
- Automatic membership verification
- Support for ERC20 token balance checks
- Currently supports Ethereum mainnet token verification

## Architecture

The application consists of two main components:

1. **Off-chain App** (`src/main.rs`): Runs as a service that monitors pending memberships and verifies token holdings
2. **On-chain Contract** (`/contracts/Messaging.sol`): Manages group data and membership states

## Prerequisites

- Oasis ROFL SDK
- Docker
- Rust toolchain

## Build

Build the off-chain app binary:

```sh
oasis rofl build sgx --mode unsafe
```

## Run

Start the localnet node using Docker:

```sh
docker run -it \
  -p8545:8545 \
  -p8546:8546 \
  -p8547:8547 \
  -p80:80 \
  -p8544:8544 \
  -v ./:/rofls \
  ghcr.io/oasisprotocol/sapphire-localnet
```

## Smart Contract Deployment

1. Compile the contract:
```sh
hh compile
```

2. Deploy to the Sapphire localnet:
```sh
hh deploy --network sapphire-localnet
```

## How It Works

1. Users can create groups with specific token requirements (token address and minimum balance)
2. Users request to join groups, creating pending memberships
3. The off-chain app periodically:
   - Fetches all pending memberships
   - Verifies token balances against group criteria
   - Automatically adds users to groups when they meet the requirements

## Supported Networks

Currently, the app supports token verification on:
- Ethereum Mainnet (Chain ID: 1)

## Development

To modify the application:
- Edit `src/main.rs` to change the off-chain app logic
- Edit `/contracts/Messaging.sol` to modify the on-chain contract functionality
