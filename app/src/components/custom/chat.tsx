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
import { FC } from "react"

interface PageProps {
  id: string
}

const Chat: FC<PageProps> = ({ id }) => {
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
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-muted p-3">
                <p>Hello!</p>
                <span className="text-xs opacity-70">12:34 PM</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg bg-primary p-3 text-primary-foreground">
                <p>Hi there!</p>
                <span className="text-xs opacity-70">12:35 PM</span>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="border-t bg-background p-4">
          <form className="flex gap-2">
            <Input
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </SidebarInset>
  )
}

export default Chat
