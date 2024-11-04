import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Plus } from "lucide-react"
import Jazzicon from 'react-jazzicon'
import { cn, copyToClipboard } from "@/lib/utils"
import { getStoredName, shortenAddress, isValidEthereumAddress } from "@/lib/utils"
import { SidebarGroupContent } from "@/components/ui/sidebar"
import { FC, useState, useMemo } from "react"
import { useSetAtom, useAtomValue } from "jotai"
import { ViewState, selectionAtom } from "@/lib/store"
import { useGetDirectMessageContacts } from "@/hooks/use-get-direct-message-contacts"
import RenameDialog from "@/components/common/rename-dialog"
import { useCheckSignIn } from "@/hooks/auth/use-check-signin"
import { toast } from "sonner"

interface DirectMessagesProps {
  searchTerm: string
  onClearSearch: () => void
}

const DirectMessages: FC<DirectMessagesProps> = ({
  searchTerm,
  onClearSearch,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState("")
  const [newName, setNewName] = useState("")

  const setSelection = useSetAtom(selectionAtom)
  const selection = useAtomValue(selectionAtom)
  const { auth } = useCheckSignIn()
  const { data: contacts } = useGetDirectMessageContacts({ auth })

  const filteredContacts = useMemo(() => {
    if (!contacts) return []
    return contacts.filter((contact) =>
      contact.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, contacts])

  const handleSelect = (view: string, id: string) => {
    setSelection({ view: view as ViewState, id })
    onClearSearch()
  }

  const handleRename = (address: string) => {
    setSelectedAddress(address)
    setNewName(getStoredName(address))
    setDialogOpen(true)
  }



  return (
    <>
      <RenameDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        addressToRename={selectedAddress}
        initialName={newName}
      />
      <SidebarGroupContent>
        {filteredContacts.length > 0 ? (
          filteredContacts.map((address) => (
            <ContextMenu key={address}>
              <ContextMenuTrigger>
                <div
                  onClick={() => handleSelect('dm', address)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer",
                    selection.view === 'dm' && selection.id === address && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Jazzicon diameter={32} seed={parseInt(address.slice(2, 10), 16)} />
                  <div className="grid">
                    <span className="font-medium">{getStoredName(address)}</span>
                    {getStoredName(address) !== shortenAddress(address) && (
                      <span className="text-xs text-muted-foreground">{shortenAddress(address)}</span>
                    )}
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleRename(address)}>
                  Rename
                </ContextMenuItem>
                <ContextMenuItem onClick={() => { copyToClipboard(address); toast.success("Copied to clipboard") }}>
                  Copy
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))
        ) : searchTerm ? (
          <div className="p-4">
            {isValidEthereumAddress(searchTerm) && (
              <button
                onClick={() => handleSelect('dm', searchTerm)}
                className="flex items-center gap-2 w-full justify-center rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Chat with {shortenAddress(searchTerm)}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No contacts found
          </div>
        )}
      </SidebarGroupContent>
    </>
  )
}

export default DirectMessages