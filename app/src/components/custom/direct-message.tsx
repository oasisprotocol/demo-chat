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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { useCheckSignIn } from "@/hooks/auth/use-check-signin"
import { getStoredName } from "@/lib/utils"

interface PageProps {
  id: string
}

const messageFormSchema = z.object({
  message: z.string().min(1),
})

type MessageFormValues = z.infer<typeof messageFormSchema>

const DirectMessage: FC<PageProps> = ({ id }) => {
  const { address } = useAccount()
  const { auth } = useCheckSignIn()
  const { data: messages } = useGetDirectMessages({ auth, otherUser: id as `0x${string}` })
  const { mutateAsync, isPending } = useSendDirectMessage()

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: "",
    },
  })

  const onSubmit = async (data: MessageFormValues) => {
    await mutateAsync({
      auth,
      to: id as `0x${string}`,
      content: data.message,
    })
    form.reset()
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
              <BreadcrumbPage>{getStoredName(id)}</BreadcrumbPage>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Type a message..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending || !form.getValues("message").trim()}
              >
                {isPending ? "Sending..." : "Send"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </SidebarInset>
  )
}

export default DirectMessage
