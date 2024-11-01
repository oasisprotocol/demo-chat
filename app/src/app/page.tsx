"use client"

import { NextPage } from "next"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const Home: NextPage = () => {
  return (
    <SidebarInset>
      <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <Badge variant="secondary" className="font-normal rounded-full px-3 py-1.5">Select a chat to start messaging</Badge>
      </div>
    </SidebarInset>
  )
}

export default Home
