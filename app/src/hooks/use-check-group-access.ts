import { useChainId } from "wagmi"
import { readContract, writeContract } from "wagmi/actions"
import { MESSAGING_CONTRACT } from "@/lib/contracts"
import { config } from "@/lib/wagmi"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

interface CheckGroupAccessParams {
  auth: SignIn | undefined
  groupId: string
  address: `0x${string}` | undefined
}

export function useCheckGroupAccess({ auth, groupId, address }: CheckGroupAccessParams) {
  const chainId = useChainId()
  const contract = MESSAGING_CONTRACT[chainId]

  const { data: isMember, isLoading: membershipLoading } = useQuery({
    queryKey: ["groupMember", groupId, address],
    queryFn: async () => {
      if (!address) return false
      const result = await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "isGroupMember",
        args: [Number(groupId), address],
      })
      return result as boolean
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    enabled: !!address && !!groupId,
  })

  const { data: isPending, isLoading: pendingLoading } = useQuery({
    queryKey: ["groupPending", groupId, address],
    queryFn: async () => {
      if (!address) return false
      const result = await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "isPendingMember",
        args: [Number(groupId), address],
      })
      return result as boolean
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    enabled: !!address && !!groupId,
  })

  const requestAccess = useMutation({
    mutationFn: async () => {
      if (!auth) throw new Error("Not authenticated")
      const result = await writeContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "requestToJoinGroup",
        args: [auth, Number(groupId)],
      })
      if (!result) throw new Error("Failed to request group access")
      return result
    },
    onError: (error: Error) => {
      console.error("Request access error:", error)
      if (error.message.includes("User rejected the request"))
        return toast.error("User denied transaction signature.")
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Access request sent successfully!")
    },
  })

  return {
    isMember,
    isPending,
    isLoading: membershipLoading || pendingLoading,
    requestAccess,
  }
}
