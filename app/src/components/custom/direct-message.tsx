import { NextPage } from "next"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FC, useState, FormEvent, useEffect } from "react"
import { useAccount } from "wagmi"
import { useSendDirectMessage } from "@/hooks/use-send-direct-message"
import { useGetDirectMessages } from "@/hooks/use-get-direct-messages"
import ChatMessage from "../common/chat-message"

interface PageProps {
  id: string
}

const DirectMessage: FC<PageProps> = ({ id }) => {
  const { address } = useAccount()
  const [auth, setAuth] = useState<SignIn | undefined>()
  const { data: messages } = useGetDirectMessages({ auth, otherUser: id as `0x${string}` })
  const sendMessage = useSendDirectMessage()
  const [messageContent, setMessageContent] = useState("")

  useEffect(() => {
    const lastSignInData = localStorage.getItem(`lastSignIn_${address}`)
    if (lastSignInData) {
      setAuth(JSON.parse(lastSignInData))
    }
  }, [address])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    sendMessage.mutateAsync({
      auth,
      to: id as `0x${string}`,
      content: messageContent,
    })
    setMessageContent("")
  }

  if (!address) return null

  return (
    <SidebarInset>
      <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage className="opacity-60">Direct Message</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages?.map((message, index) => (
              <ChatMessage key={index} message={message} address={address} />
            ))}
          </div>
        </ScrollArea>
        <div className="border-t bg-background p-4">
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <Input
              placeholder="Type a message..."
              className="flex-1"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <Button
              type="submit"
              disabled={sendMessage.isPending || !messageContent.trim()}
            >
              {sendMessage.isPending ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </SidebarInset>
  )
}

export default DirectMessage
