# Instructions

## Build

Edit the `src/main.rs` file to change the functionality.

Then build the off-chain logic to a binary.

```sh
oasis rofl build sgx --mode unsafe
```

## Run

Docker image using the binary built above for the localnet node.

```sh
docker run -it -p8545:8545 -p8546:8546 -v ./:/rofls ghcr.io/oasisprotocol/sapphire-localnet
```

## On-chain

Edit the `oracle/contracts/Oracle.sol` file to change the on chain contract functionality.

Compile the on-chain contract.

```sh
hh compile
```

Deploy the on-chain contract.

```sh
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 && hh deploy rofl1qqn9xndja7e2pnxhttktmecvwzz0yqwxsquqyxdf --network sapphire-localnet
```

## Query

Query the on-chain contract.
```sh
hh oracle-query 0x5FbDB2315678afecb367f032d93F642f64180aa3  --network sapphire-localnet
```


