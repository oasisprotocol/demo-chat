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
import { FC, useState, FormEvent } from "react"
import { useGetGroupMessages } from "@/hooks/use-get-group-messages"
import { useSendGroupMessage } from "@/hooks/use-send-group-message"
import { useAccount } from "wagmi"
import ChatMessage from "../common/chat-message"
import { useCheckSignIn } from "@/hooks/auth/use-check-signin"
import { useCheckGroupAccess } from "@/hooks/use-check-group-access"


interface PageProps {
  id: string
}

const Group: FC<PageProps> = ({ id }) => {
  const { address } = useAccount()
  const { auth } = useCheckSignIn()
  const { isMember, isPending, isLoading, requestAccess } = useCheckGroupAccess({
    auth,
    groupId: id,
    address: address as `0x${string}`,
  })
  const { data: messages } = useGetGroupMessages(auth, Number(id))
  const sendMessage = useSendGroupMessage()
  const [messageContent, setMessageContent] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    sendMessage.mutateAsync({
      auth,
      groupId: Number(id),
      content: messageContent,
    })
    setMessageContent("")
  }

  if (!address) return null
  if (isLoading) return <div>Loading...</div>

  if (!isMember) {
    return (
      <SidebarInset>
        <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
          <h2 className="text-xl font-semibold">Access Required</h2>
          <p className="text-center text-muted-foreground">
            {isPending
              ? "Your access request is pending approval"
              : "You need to be a member of this group to view messages"
            }
          </p>
          {!isPending && <Button onClick={() => requestAccess.mutateAsync()}>Request Access</Button>}
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage className="opacity-60">Group</BreadcrumbPage>
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

export default Group

