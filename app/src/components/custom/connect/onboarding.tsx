import { FC } from "react"
import Logo from "../../../icons/logo"
import { Button } from "@/components/ui/button"
import { useConnect } from "wagmi"
import Loading from "./loading"

const Onboarding: FC = () => {
  const { connectors, connect, isPending } = useConnect()

  if (isPending) return <Loading />

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="flex items-center justify-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-move-to-top">
        <Logo className="hover:animate-rotate-360" width={52} height={52} />
        <h1 className="text-5xl font-semibold">E2E Chat</h1>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-delayed w-full px-6 flex justify-center">
        <Button
          className="h-14 rounded-full max-w-lg w-full"
          disabled={isPending}
          onClick={() => connect({ connector: connectors[0] })}
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  )
}

export default Onboarding
