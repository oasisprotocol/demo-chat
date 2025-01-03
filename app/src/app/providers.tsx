"use client"

import { ThemeProvider } from "next-themes"
import { FC, ReactNode } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/lib/wagmi"
import Connect from "@/components/custom/connect"

const queryClient = new QueryClient()

const Providers: FC<{
  children: ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Connect>
            {children}
          </Connect>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}

export default Providers
