import { useChainId } from "wagmi"
import { readContract } from "wagmi/actions"
import { MESSAGING_CONTRACT } from "@/lib/contracts"
import { config } from "@/lib/wagmi"
import { useQuery } from "@tanstack/react-query"

export function useGetDirectMessageContacts({ auth }: { auth: SignIn | undefined }) {
  const chainId = useChainId()

  return useQuery<`0x${string}`[]>({
    queryKey: ["directMessageContacts"],
    queryFn: async () => {
      const contract = MESSAGING_CONTRACT[chainId]

      const result = await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "getDirectMessageContacts",
        args: [auth],
      })

      if (!result) throw new Error("Failed to fetch direct message contacts")
      return result as `0x${string}`[]
    },
    enabled: !!auth,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  })
}
