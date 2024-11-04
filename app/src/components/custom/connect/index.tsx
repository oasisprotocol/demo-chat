import { FC, ReactNode, useEffect, useState } from 'react';
import { SidebarProvider } from '../../ui/sidebar';
import AppSidebar from '../app-sidebar';
import { useAccount } from 'wagmi';
import Onboarding from './onboarding';
import Loading from './loading';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectionAtom } from '@/lib/store';
import { useCheckSignIn } from '@/hooks/auth/use-check-signin';
import SignIn from './sign-in';

interface Props {
  children: ReactNode
}

const Connect: FC<Props> = ({ children }) => {
  const { address } = useAccount()
  const [isClient, setIsClient] = useState(false)
  const { isSignedIn, auth } = useCheckSignIn()

  const setSelection = useSetAtom(selectionAtom)
  const selection = useAtomValue(selectionAtom)

  useEffect(() => setIsClient(true), [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {      
      if (e.key === 'Escape' && selection.id) {
        setSelection({ view: selection.view, id: null })
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [setSelection, selection.view, selection.id])

  if (!isClient) return <Loading />
  if (!address) return <Onboarding />
  if (!isSignedIn || !auth) return <SignIn />

  return (
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
  );
};

export default Connect;