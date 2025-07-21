import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from '@/components/common/Header'
import Sidebar from '@/components/common/Sidebar'
import useBreakPoints from '@/hooks/use-break-points'

const Layout: React.FC = () => {
  const [isOpened, { toggle, close }] = useDisclosure(true)
  const { isMaxTabletView } = useBreakPoints()
  return (
    <AppShell
      layout="alt"
      h="97%"
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !isOpened, desktop: !isOpened },
      }}
      header={{
        height: {
          md: 80,
        },
      }}
      padding="lg"
    >
      <Header toggle={toggle} />
      <Sidebar isOpened={isOpened} close={close} />
      <AppShell.Main
        className={`${isMaxTabletView ? 'pt-40' : 'pt-28'} bg-alt-white-1`}
      >
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default Layout
