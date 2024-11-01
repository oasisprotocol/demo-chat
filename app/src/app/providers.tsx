"use client"

import { ThemeProvider } from "next-themes"
import { FC, ReactNode } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/lib/wagmi"
import { AppSidebar } from "@/components/custom/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const queryClient = new QueryClient()

const Providers: FC<{
  children: ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "350px",
              } as React.CSSProperties
            }
          >
            <AppSidebar />
            {children}
          </SidebarProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}

export default Providers
