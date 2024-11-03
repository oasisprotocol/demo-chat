import { sapphire, sapphireTestnet } from "wagmi/chains"

import { sapphireLocalnet } from "@oasisprotocol/sapphire-wagmi-v2"
import { Abi } from "viem"
import { ABI } from "./abi"

export const MESSAGING_CONTRACT: Record<
  number,
  { address: `0x${string}`; abi: Abi }
> = {
  [sapphire.id]: {
    address: "0x0000000000000000000000000000000000000000",
    abi: ABI,
  },
  [sapphireTestnet.id]: {
    address: "0x0000000000000000000000000000000000000000",
    abi: ABI,
  },
  [sapphireLocalnet.id]: {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: ABI,
  },
}
