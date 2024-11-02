import { toast } from "sonner"
import { useChainId } from "wagmi"
import { writeContract } from "wagmi/actions"
import { config } from "@/lib/wagmi"
import { useMutation } from "@tanstack/react-query"
import { MESSAGING_CONTRACT } from "@/lib/contracts"

interface SendGroupMessageParams {
  groupId: number
  content: string
}

export function useSendGroupMessage() {
  const chainId = useChainId()
  const contract = MESSAGING_CONTRACT[chainId]

  const sendMutation = useMutation({
    mutationFn: async ({ groupId, content }: SendGroupMessageParams) => {
      const result = await writeContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "sendGroupMessage",
        args: [groupId, content],
      })

      if (!result) throw new Error("Failed to send message")

      return result
    },
    onError: (error: Error) => {
      console.error("Send group message error:", error)
      if (error.message.includes("User rejected the request"))
        return toast.error("User denied transaction signature.")
      toast.error(error.message)
    },
    onSuccess: (result) => {
      toast.success("Group message sent successfully!")
      console.log("Group message sent successfully:", result)
    },
  })

  return sendMutation
}
