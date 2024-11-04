"use client"

import { Sidebar } from "@/components/ui/sidebar"
import IconSidebar from "./icon-sidebar"
import ContentSidebar from "./content-sidebar"
import { ComponentProps, FC } from "react"

const AppSidebar: FC<ComponentProps<typeof Sidebar>> = (props) => {
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:!flex-row"
      {...props}
    >
      <IconSidebar />
      <ContentSidebar />
    </Sidebar>
  )
}

export default AppSidebar
