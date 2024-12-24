# 🏗️ CraneChat (demo-chat)

An E2E encrypted chat with token gated group chats built on Oasis Sapphire with ROFL.

## !! Disclaimer !!

This is a demo application and should not be used in production.

## How It Works

CraneChat is a decentralized chat application that provides:

1. **Token Gated Group Chats**: Create groups that require members to hold specific token amounts on supported chains to join
2. **Direct Messaging**: Send encrypted messages directly to other users
3. **E2E Encryption**: All messages are encrypted using Oasis Sapphire's confidential smart contracts
4. **ROFL Integration**: Automated token balance verification using ROFL (Remote Offchain Fault-tolerant Logic)

The application consists of:
- Smart contracts deployed on Oasis Sapphire
- ROFL application for off-chain token balance verification
- Next.js frontend with Wagmi for web3 integration

## Directory Structure

- `/` (root): Smart contracts (Hardhat project)
- `app/`: Next.js frontend
- `rofl/`: ROFL application

## Setup

1. Install dependencies:

```sh
pnpm install
cd app
pnpm install
```

2. Configure environment variables:

```sh
cp .env.template .env
```

## Running

1. Start the frontend development server:

```sh
cd app
pnpm dev
```

2. For local ROFL development:

Check the ([`rofl/README.md`](./rofl/README.md)) for instructions on running the ROFL service.

3. Deploy contracts:

```sh
npx hardhat deploy --network sapphire-localnet
```

4. To populate test groups (optional):

```sh
npx hardhat populate --network sapphire-localnet --contract <CONTRACT_ADDRESS>
```
