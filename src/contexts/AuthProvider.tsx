import { compare, hash } from 'bcrypt-ts'
import { PropsWithChildren } from 'react'

import { AuthContext } from '@/hooks/use-auth-context'
import {
  TAuthenticatedUser,
  TLoginForm,
  TSignUpForm,
  TUser,
} from '@/types/schemaTypes'
import useLocalStorage from '@/hooks/use-local-storage'

const AuthProvider = ({ children }: PropsWithChildren) => {
  const { persistedValue: usersList, saveToLocalStorage: saveUsersList } =
    useLocalStorage<TUser[]>('users', [])
  const {
    persistedValue: user,
    saveToLocalStorage: saveUser,
    clearPersistedValue: logoutAuthUser,
  } = useLocalStorage<TAuthenticatedUser | null>('user', null)
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
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message)
      }
    }
  }

  const logout = () => {
    logoutAuthUser()
  }

  return (
    <AuthContext.Provider value={{ user, usersList, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
