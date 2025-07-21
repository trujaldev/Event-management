import { AppShell, Center, CloseButton, Flex, List, Title } from '@mantine/core'
import React from 'react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

import ForEach from '@/components/common/ForEach'
import useBreakPoints from '@/hooks/use-break-points'
import { availableRoutes } from '@/routes/routesConfig'

interface SidebarProps {
  isOpened: boolean
  close: () => void
}

const sidebarNavigationRoutes = [
  { path: availableRoutes.EVENTS, title: 'Events' },
]

const Sidebar: React.FC<SidebarProps> = ({ close, isOpened }) => {
  const iconMap = {
    [availableRoutes.EVENTS]: <FaRegCalendarAlt />,
  }
  const { isMaxTabletView } = useBreakPoints()

  const onNavigateHandler = () => {
    if (isMaxTabletView) {
      close()
    }
  }

  return (
    <AppShell.Navbar className="!bg-alt-blue-1 py-6 px-4 text-alt-white-1">
      {isOpened && isMaxTabletView && (
        <CloseButton
          size="lg"
          className="absolute top-3 right-3 text-alt-white-1"
          onClick={close}
        />
      )}
      <Center className="mb-8">
        <Title order={3}>Dashboard</Title>
      </Center>
      <Flex direction="column" gap={'xl'}>
        <List size="sm" center className="flex flex-col gap-4">
          <ForEach
            of={sidebarNavigationRoutes}
            render={(item) => {
              return (
                <NavLink
                  key={item.path}
                  onClick={onNavigateHandler}
                  className={({ isActive }) => {
                    return `${
                      isActive
                        ? 'bg-alt-blue-3 navigation-item-active text-alt-white-1'
                        : ''
                    } navigation-item rounded-md py-2 px-4 hover:bg-alt-blue-3 hover:text-alt-white-1 cursor-pointer font-semibold`
                  }}
                  to={item.path}
                >
                  <List.Item icon={iconMap[item.path]}>{item.title}</List.Item>
                </NavLink>
              )
            }}
          />
        </List>
      </Flex>
    </AppShell.Navbar>
  )
}

export default Sidebar
