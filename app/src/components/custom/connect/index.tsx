import { FC, ReactNode, useEffect, useState } from 'react';
import { SidebarProvider } from '../../ui/sidebar';
import { AppSidebar } from '../app-sidebar';
import { useAccount } from 'wagmi';
import Onboarding from './onboarding';
import Loading from './loading';

interface Props {
  children: ReactNode
}

const Connect: FC<Props> = ({ children }) => {
  const { address } = useAccount()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  if (!isClient) return <Loading />
  if (!address) return <Onboarding />

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