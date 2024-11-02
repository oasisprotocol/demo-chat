"use client"

import { LogOut, MessageCircle, Origami, Users, Plus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useState, useMemo, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { useSetAtom, useAtomValue } from "jotai"
import { selectionAtom } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useGetAllGroups } from "@/hooks/use-get-all-groups"
import { useGetDirectMessageContacts } from "@/hooks/use-get-direct-message-contacts"

const data = {
  navMain: [
    {
      title: "Direct Messages",
      icon: MessageCircle,
      isActive: true,
    },
    {
      title: "Groups",
      icon: Users,
      isActive: false,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = useState(data.navMain[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [auth, setAuth] = useState<SignIn | undefined>()
  const { address } = useAccount()

  useEffect(() => {
    const lastSignInData = localStorage.getItem(`lastSignIn_${address}`)
    if (lastSignInData) {
      setAuth(JSON.parse(lastSignInData))
    }
  }, [address])

  const { setOpen } = useSidebar()
  const { disconnect } = useDisconnect()

  const setSelection = useSetAtom(selectionAtom)
  const selection = useAtomValue(selectionAtom)

  const { data: groups, isLoading: isLoadingGroups } = useGetAllGroups()
  const { data: contacts, isLoading: isLoadingContacts } = useGetDirectMessageContacts({ auth })

  const filteredContacts = useMemo(() => {
    if (!contacts) return []
    return contacts.filter((contact) =>
      contact.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, contacts])

  const filteredGroups = useMemo(() => {
    if (!groups) return []
    return groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, groups])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="md:h-8 md:p-0">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Origami className="size-4" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setOpen(true)
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="flex justify-center items-center">
          <SidebarMenuButton
            tooltip={{
              children: "Disconnect",
              hidden: false,
            }}
            onClick={() => disconnect()}
            className="px-2.5 md:px-2"
          >
            <LogOut className="size-4 text-destructive cursor-pointer" />
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
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
            {activeItem.title === "Direct Messages" ? (
              <SidebarGroupContent>
                {isLoadingContacts ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading contacts...
                  </div>
                ) : filteredContacts.length > 0 ? (
                  filteredContacts.map((address) => (
                    <div
                      onClick={() => setSelection({ view: 'chat', id: address })}
                      key={address}
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer",
                        selection.view === 'chat' && selection.id === address && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <div className="size-8 rounded-full bg-muted" />
                      <div className="grid">
                        <span className="font-medium">{address}</span>
                        <span className="text-xs text-muted-foreground">
                          {address}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4">
                    <div className="text-center text-muted-foreground mb-2">
                      No contacts found
                    </div>
                    <button
                      onClick={() => setSelection({ view: 'chat', id: searchTerm })}
                      className="flex items-center gap-2 w-full justify-center rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                    >
                      <Plus className="size-4" />
                      <span>Start new chat with {searchTerm}</span>
                    </button>
                  </div>
                )}
              </SidebarGroupContent>
            ) : (
              <SidebarGroupContent>
                {isLoadingGroups ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading groups...
                  </div>
                ) : filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <div
                      onClick={() => setSelection({ view: 'group', id: group.groupId.toString() })}
                      key={group.groupId}
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer",
                        selection.view === 'group' && selection.id === group.groupId.toString() && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <div className="size-8 rounded-full bg-muted" />
                      <div className="grid">
                        <span className="font-medium">{group.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {group.members.length} members
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4">
                    <div className="text-center text-muted-foreground mb-2">
                      No groups found
                    </div>
                    <button
                      // onClick={() => setSelection({ view: 'createGroup', id: searchTerm })}
                      className="flex items-center gap-2 w-full justify-center rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                    >
                      <Plus className="size-4" />
                      <span>Create new group "{searchTerm}"</span>
                    </button>
                  </div>
                )}
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}