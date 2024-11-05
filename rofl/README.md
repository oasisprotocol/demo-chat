# ROFL (Runtime OFf-chain Logic) App

ROFL is a decentralized messaging application that manages group memberships based on token holdings. It serves as an off-chain oracle that verifies token balances and automatically manages group memberships.

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

## Prerequisites

Install the [`ROFL pre-requisites`](https://docs.oasis.io/rofl/prerequisites)

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

## Logs

Read the logs from the running node:

```sh
docker ps | awk '{print $NF}' | xargs -I {} docker exec {} cat /serverdir/node/net-runner/network/compute-0/node.log
```
