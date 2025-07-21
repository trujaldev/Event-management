import {
  AppShell,
  Avatar,
  Flex,
  Group,
  Image,
  Menu,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import React from 'react'

import Toggle from '@/assets/svg/toggle.svg'
import useAuthContext from '@/hooks/use-auth-context'
import useBreakPoints from '@/hooks/use-break-points'

interface HeaderProps {
  toggle: () => void
}

const Header: React.FC<HeaderProps> = (props) => {
  const { user, logout } = useAuthContext()
  const { isMaxTabletView } = useBreakPoints()
  const { toggle } = props

  const handleLogout = () => {
    logout()
  }

  return (
    <AppShell.Header className="px-5 py-4 mobile:px-3 shadow-alt-box-1">
      <Flex
        justify={'space-between'}
        align={isMaxTabletView ? 'flex-start' : 'center'}
        direction={isMaxTabletView ? 'column' : 'row'}
        gap={isMaxTabletView ? 16 : 8}
        wrap="wrap"
      >
        <Group>
          <Image
            onClick={toggle}
            radius="md"
            className="object-contain w-9 max-w-full h-9 cursor-pointer"
            src={Toggle}
            fit="contain"
          />
          <Title order={2} className="text-alt-blue-2 mobile:text-lg">
            Event Management
          </Title>
        </Group>
        <Group className={`w-auto mobile:gap-0`}>
          <Stack align="flex-start" gap={0}>
            <Text className="mobile:text-sm" fw={'bold'}>
              {user?.user_name}
            </Text>
            <Text className="mobile:text-sm">{user?.email}</Text>
          </Stack>
          <Menu
            width={200}
            shadow="md"
            transitionProps={{ transition: 'fade-down', duration: 150 }}
          >
            <Menu.Target>
              <Avatar
                className="cursor-pointer"
                size="md"
                key={user?.user_name}
                name={user?.user_name}
                color="initials"
              />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item color="dark" fw="bold" onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>
    </AppShell.Header>
  )
}

export default Header
