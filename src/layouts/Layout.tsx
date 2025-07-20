import { AppShell } from '@mantine/core'
import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from '@/components/common/Header'
import Sidebar from '@/components/common/Sidebar'

const Layout: React.FC = () => {
  return (
    <AppShell
      layout="alt"
      h="97%"
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: false, desktop: false },
      }}
      header={{
        height: {
          md: 80,
        },
      }}
      padding="lg"
    >
      <Header />
      <Sidebar />
      <AppShell.Main className={'pt-28 bg-alt-white-1'}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default Layout
