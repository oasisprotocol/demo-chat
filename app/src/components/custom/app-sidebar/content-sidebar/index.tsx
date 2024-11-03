import { Plus } from "lucide-react"
import { useState, useMemo, FC } from "react"
import { useSetAtom, useAtomValue } from "jotai"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import DirectMessages from "./direct-messages"
import { Groups } from "./groups"
import { selectionAtom } from "@/lib/store"
import { CreateGroupDialog } from "../../../common/create-group-dialog"

const ContentSidebar: FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [createGroupOpen, setCreateGroupOpen] = useState(false)

  const selection = useAtomValue(selectionAtom)

  const isDirectMessages = selection.view === 'dm'
  const title = isDirectMessages ? "Direct Messages" : "Groups"

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <CreateGroupDialog
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
      />
      <SidebarHeader className="border-b p-4">
        <div className="flex w-full items-center justify-between h-12">
          <div className="text-base font-medium text-foreground">
            {title}
          </div>
          <div className="min-w-20">
            {!isDirectMessages && (
              <Button
                variant="default"
                size="sm"
                className="px-2"
                onClick={() => setCreateGroupOpen(true)}
              >
                <Plus className="size-4" />
                Create Group
              </Button>
            )}
          </div>
        </div>
        <SidebarInput
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {selection.view === "dm" ? (
            <DirectMessages
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm('')}
            />
          ) : (
            <Groups searchTerm={searchTerm} />
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default ContentSidebar
