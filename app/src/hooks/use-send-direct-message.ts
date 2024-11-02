import { toast } from "sonner"
import { useChainId } from "wagmi"
import { writeContract } from "wagmi/actions"
import { config } from "@/lib/wagmi"
import { useMutation } from "@tanstack/react-query"
import { MESSAGING_CONTRACT } from "@/lib/contracts"

interface SendMessageParams {
  auth: SignIn | undefined
  to: `0x${string}`
  content: string
}

export function useSendDirectMessage() {
  const chainId = useChainId()
  const contract = MESSAGING_CONTRACT[chainId]

  const sendMutation = useMutation({
    mutationFn: async ({ auth, to, content }: SendMessageParams) => {
      const result = await writeContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "sendDirectMessage",
        args: [auth, to, content],
      })

      if (!result) throw new Error("Failed to send message")

      return result
    },
    onError: (error: Error) => {
      console.error("Send message error:", error)
      if (error.message.includes("User rejected the request"))
        return toast.error("User denied transaction signature.")
      toast.error(error.message)
    },
    onSuccess: (result) => {
      toast.success("Message sent successfully!")
      console.log("Message sent successfully:", result)
    },
  })

  return sendMutation
}
