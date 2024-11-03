import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useCreateGroup } from "@/hooks/use-create-group"
import { useCheckSignIn } from "@/hooks/auth/use-check-signin"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGroupDialog({
  open,
  onOpenChange,
}: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("")
  const [tokenAddress, setTokenAddress] = useState("")
  const [requiredAmount, setRequiredAmount] = useState("")
  const [chainId, setChainId] = useState("1")

  const { auth } = useCheckSignIn()

  const { mutateAsync: createGroup } = useCreateGroup()

  const handleSubmit = async () => {
    if (!auth) return

    await createGroup({
      auth,
      name: groupName,
      chainId: parseInt(chainId),
      tokenAddress: tokenAddress as `0x${string}`,
      requiredAmount: requiredAmount
    })

    onOpenChange(false)
    // Reset form
    setGroupName("")
    setTokenAddress("")
    setRequiredAmount("")
    setChainId("1")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Group Name</label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Chain ID</label>
            <Input
              type="number"
              value={chainId}
              onChange={(e) => setChainId(e.target.value)}
              placeholder="Enter chain ID"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Token Address</label>
            <Input
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="Enter token address"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Required Amount</label>
            <Input
              type="number"
              value={requiredAmount}
              onChange={(e) => setRequiredAmount(e.target.value)}
              placeholder="Enter required token amount"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!groupName || !tokenAddress || !requiredAmount || !chainId}
          >
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 