"use client"

import * as React from "react"
import { MessageCircle, Origami, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// This is sample data - replace with actual data from the contract
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Direct Messages",
      url: "#",
      icon: MessageCircle,
      isActive: true,
    },
    {
      title: "Groups",
      url: "#",
      icon: Users,
      isActive: false,
    },
  ],
  contacts: [
    {
      name: "Alice Smith",
      address: "0x1234...5678",
      avatar: "/avatars/alice.jpg",
    },
    {
      name: "Bob Johnson",
      address: "0x8765...4321",
      avatar: "/avatars/bob.jpg",
    },
  ],
  groups: [
    {
      id: 1,
      name: "NFT Holders",
      members: ["0x1234...5678", "0x8765...4321"],
    },
    {
      id: 2,
      name: "DAO Members",
      members: ["0x1234...5678", "0x8765...4321"],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [searchTerm, setSearchTerm] = React.useState("")
  const { setOpen } = useSidebar()

  // Filter function for contacts and groups
  const filteredContacts = React.useMemo(() => {
    return data.contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const filteredGroups = React.useMemo(() => {
    return data.groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

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
                {filteredContacts.map((contact) => (
                  <a
                    href={`/dm/${contact.address}`}
                    key={contact.address}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <div className="size-8 rounded-full bg-muted" />
                    <div className="grid">
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {contact.address}
                      </span>
                    </div>
                  </a>
                ))}
              </SidebarGroupContent>
            ) : (
              <SidebarGroupContent>
                {filteredGroups.map((group) => (
                  <a
                    href={`/group/${group.id}`}
                    key={group.id}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <div className="size-8 rounded-full bg-muted" />
                    <div className="grid">
                      <span className="font-medium">{group.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {group.members.length} members
                      </span>
                    </div>
                  </a>
                ))}
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}