import { useLocalStorage } from '@mantine/hooks'
import { compare, hash } from 'bcrypt-ts'
import { PropsWithChildren } from 'react'

import { AuthContext } from '@/hooks/use-auth-context'
import useEventContext from '@/hooks/use-event-context'
import {
  TAuthenticatedUser,
  TLoginForm,
  TSignUpForm,
  TUser,
} from '@/types/schemaTypes'
import { dummyEvents } from '@/utils/dummyData'

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [usersList, saveUsersList] = useLocalStorage<TUser[]>({
    key: 'users',
    defaultValue: [],
    getInitialValueInEffect: false,
  })

  const [user, saveUser, clearLocalStorageUserKey] =
    useLocalStorage<TAuthenticatedUser | null>({
      key: 'user',
      defaultValue: null,
      getInitialValueInEffect: false,
    })

  const { saveMultipleEvents, clearLocalStorageEventKey } = useEventContext()
  const saltRounds = 10

  const signUp = async (userData: Omit<TSignUpForm, 'confirm_password'>) => {
    try {
      const existingUser = usersList.find(
        (user) => user.email.toLowerCase() === userData.email.toLowerCase(),
      )

      if (existingUser) {
        throw new Error(
          'An account with this email already exists. Please try logging in or use a different email address.',
        )
      }

      const hashedPassword = await hash(userData?.password, saltRounds)

      const hashedUserData = {
        ...userData,
        password: hashedPassword,
      }

      saveUsersList((prev) => [...prev, hashedUserData])
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message)
      }
    }
  }

  const login = async (userData: TLoginForm) => {
    try {
      const existingUser = usersList.find(
        (user) => user.email.toLowerCase() === userData.email.toLowerCase(),
      )

      if (!existingUser) {
        throw new Error(
          'Invalid Credentials! the email you provided is incorrect',
        )
      }

      const { password, ...restUserData } = existingUser
      const isPasswordValid = await compare(userData.password, password)

      if (!isPasswordValid) {
        throw new Error(
          'Invalid Credentials! the password you provided is incorrect',
        )
      }

      saveUser(restUserData)
      saveMultipleEvents(dummyEvents)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message)
      }
    }
  }

  const logout = () => {
    clearLocalStorageUserKey()
    clearLocalStorageEventKey()
  }

  return (
    <AuthContext.Provider value={{ user, usersList, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
