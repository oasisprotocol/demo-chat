import { Hex } from "viem"

declare global {
  type SignIn = {
    user: Hex
    time: number
    rsv: {
      r: Hex
      s: Hex
      v: number
    }
  }
  
  type GroupCriteria = {
    chainId: number
    tokenAddress: string
    requiredAmount: bigint
  }

  type Group = {
    groupId: number
    name: string
    members: string[]
    criteria: GroupCriteria
    exists: boolean
  }

  type Message = {
    sender: string
    content: string
    timestamp: number
  }
}

export default global
