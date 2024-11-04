import { FC } from "react"
import { Button } from "@/components/ui/button"
import { useConnect } from "wagmi"
import Loading from "./loading"
import { OrigamiIcon } from "lucide-react"

const Onboarding: FC = () => {
  const { connectors, connect, isPending } = useConnect()

  if (isPending) return <Loading />

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="flex items-center justify-center gap-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-move-to-top">
        <OrigamiIcon className="hover:animate-rotate-360" width={52} height={52} />
        <h1 className="text-4xl font-bold">CraneChat</h1>
      </div>
      <OrigamiIcon
        className="absolute -bottom-40 -left-40 text-primary opacity-[0.05]"
        size={600}
        strokeWidth={0.1}
      />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-delayed w-full px-6 flex justify-center">
        <Button
          className="h-12 rounded-full max-w-lg w-full"
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
