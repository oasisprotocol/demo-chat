import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FC } from "react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  addressToRename: string
  initialName: string
}

const RenameDialog: FC<Props> = ({
  open,
  onOpenChange,
  addressToRename,
  initialName,
}) => {
  const save = (value: string) => {
    localStorage.setItem(`name_${addressToRename}`, value)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Contact</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            defaultValue={initialName}
            placeholder="Enter new name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') save(e.currentTarget.value)
            }}
          />
          <Button onClick={(e) => save((e.currentTarget.form?.elements.namedItem('name') as HTMLInputElement).value)}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RenameDialog
