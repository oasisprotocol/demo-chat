import { useChainId } from "wagmi"
import { readContract } from "wagmi/actions"
import { MESSAGING_CONTRACT } from "@/lib/contracts"
import { config } from "@/lib/wagmi"
import { useQuery } from "@tanstack/react-query"

export function useGetDirectMessages({ auth, otherUser }: { auth: SignIn | undefined, otherUser: `0x${string}` }) {
  const chainId = useChainId()

  return useQuery<Message[]>({
    queryKey: ["directMessages", otherUser],
    queryFn: async () => {
      const contract = MESSAGING_CONTRACT[chainId]

      const result = await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "getDirectMessages",
        args: [auth, otherUser],
      })

      if (!result) throw new Error("Failed to fetch direct messages")
      return result as Message[]
    },
    enabled: !!auth,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  })
}
