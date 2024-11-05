# CraneChat (demo-chat)

An E2E encrypted chat with token gated group chats built on Oasis Sapphire with ROFL.

## How It Works

CraneChat is a decentralized chat application that provides:

1. **Token Gated Group Chats**: Create groups that require members to hold specific token amounts on supported chains to join
2. **Direct Messaging**: Send encrypted messages directly to other users
3. **E2E Encryption**: All messages are encrypted using Oasis Sapphire's confidential smart contracts
4. **ROFL Integration**: Automated token balance verification using ROFL (Remote Offchain Fault-tolerant Logic)

The application consists of:
- Smart contracts deployed on Oasis Sapphire
- ROFL service for off-chain token balance verification
- Next.js frontend with Wagmi for web3 integration

## Pre-requisites

- Node.js 18+
- Rust toolchain (for ROFL development)
- Hardhat

## Setup

1. Install dependencies:

```sh
pnpm install
```

2. Configure environment variables:

```sh
cp .env.example .env
```

3. Deploy contracts:

To be deployed after ROFL is running.

```sh
npx hardhat deploy --network sapphire-localnet
```

4. Update the contract address in `app/.env.local`

## Running

1. Start the frontend development server:

```sh
cd app
pnpm dev
```

2. For local ROFL development:

Check the ([`rofl/README.md`](./rofl/README.md)) for instructions on running the ROFL service.

3. To populate test groups (optional):

```sh
npx hardhat populate --network sapphire-localnet --contract <CONTRACT_ADDRESS>
```
