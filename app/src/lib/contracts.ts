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
    address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    abi: ABI,
  },
}
