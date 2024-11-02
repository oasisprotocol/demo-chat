import { useChainId } from "wagmi"
import { readContract } from "wagmi/actions"
import { MESSAGING_CONTRACT } from "@/lib/contracts"
import { config } from "@/lib/wagmi"
import { useQuery } from "@tanstack/react-query"

export function useGetAllGroups({ auth }: { auth: SignIn | undefined }) {
  const chainId = useChainId()

  return useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const contract = MESSAGING_CONTRACT[chainId]

      const result = await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "getAllGroups",
        args: [auth],
      })

      if (!result) throw new Error("Failed to fetch groups")
      return result as Group[]
    },
    enabled: !!auth,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  })
}
