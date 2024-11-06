"use client"

import { NextPage } from "next"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useAccount } from "wagmi"
import { selectionAtom } from "@/lib/store"
import { useAtomValue } from "jotai"
import Group from "@/components/custom/group"
import DirectMessage from "@/components/custom/direct-message"

const Home: NextPage = () => {
  const { address } = useAccount()
  const selection = useAtomValue(selectionAtom)

  if (!address) return null

  const defaultView = (
    <SidebarInset>
      <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <Badge variant="secondary" className="font-normal border px-3 py-1.5">
          Select a chat to start messaging
        </Badge>
      </div>
    </SidebarInset>
  )

  if (!selection.id) return defaultView

  return selection.view === 'dm'
    ? <DirectMessage id={selection.id} />
    : selection.view === 'group'
      ? <Group id={selection.id} />
      : defaultView
}

export default Home
