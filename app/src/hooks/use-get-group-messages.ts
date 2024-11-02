import { useChainId } from "wagmi"
import { readContract } from "wagmi/actions"
import { MESSAGING_CONTRACT } from "@/lib/contracts"
import { config } from "@/lib/wagmi"
import { useQuery } from "@tanstack/react-query"

export function useGetGroupMessages(groupId: number) {
  const chainId = useChainId()

  return useQuery<Message[]>({
    queryKey: ["groupMessages", groupId],
    queryFn: async () => {
      const contract = MESSAGING_CONTRACT[chainId]

      const result = await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "getGroupMessages",
        args: [groupId],
      })

      if (!result) throw new Error("Failed to fetch group messages")
      return result as Message[]
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  })
}
