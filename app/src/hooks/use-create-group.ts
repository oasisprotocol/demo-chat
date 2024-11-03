import { toast } from "sonner"
import { useChainId } from "wagmi"
import { writeContract } from "wagmi/actions"
import { config } from "@/lib/wagmi"
import { useMutation } from "@tanstack/react-query"
import { MESSAGING_CONTRACT } from "@/lib/contracts"
import { parseUnits } from "viem"

interface CreateGroupParams {
  auth: SignIn | undefined
  name: string
  chainId: number
  tokenAddress: `0x${string}`
  requiredAmount: string
}

export function useCreateGroup() {
  const chainId = useChainId()
  const contract = MESSAGING_CONTRACT[chainId]

  const createMutation = useMutation({
    mutationFn: async ({ auth, name, chainId, tokenAddress, requiredAmount }: CreateGroupParams) => {
      const requiredAmountInWei = parseUnits(requiredAmount, 18)

      const result = await writeContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "createGroup",
        args: [auth, name, chainId, tokenAddress, requiredAmountInWei],
      })

      if (!result) throw new Error("Failed to create group")

      return result
    },
    onError: (error: Error) => {
      console.error("Create group error:", error)
      if (error.message.includes("User rejected the request"))
        return toast.error("User denied transaction signature.")
      toast.error(error.message)
    },
    onSuccess: (result) => {
      toast.success("Group created successfully!")
      console.log("Group created successfully:", result)
    },
  })

  return createMutation
}
