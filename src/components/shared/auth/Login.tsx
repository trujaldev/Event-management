import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import React from 'react'
import { Controller, FieldErrors, FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { loginFormSchema } from '@/components/shared/auth/schema'
import useAuthContext from '@/hooks/use-auth-context'
import { availableRoutes } from '@/routes/routesConfig'
import { TLoginForm } from '@/types/schemaTypes'

const Login: React.FC = () => {
  const formMethods = useForm<TLoginForm>({
    resolver: zodResolver(loginFormSchema),
    values: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = formMethods

  const { login } = useAuthContext()
  const navigate = useNavigate()

  const successHandler = async (data: TLoginForm) => {
    try {
      await login(data)
      navigate(availableRoutes.HOME)
      toast.success('You are logged in successfully!')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message)
      }
    }
  }

  const errorHandler = (errors: FieldErrors) => {
    console.log(errors)
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(successHandler, errorHandler)}
        className="bg-alt-white-1 h-inherit"
      >
        <Stack p={32} className="flex h-full">
          <Flex direction="column" w="100%" className="max-w-[25rem]" m="auto">
            <Stack gap={8}>
              <Title ta="center" className="text-alt-dark-1">
                Welcome back!
              </Title>
              <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' '}
                <Link
                  to={availableRoutes.SIGN_UP}
                  className="font-semibold text-alt-blue-2"
                >
                  Create account
                </Link>
              </Text>
            </Stack>

            <Paper
              withBorder
              shadow="md"
              p={30}
              mt={32}
              radius="md"
              className="w-full"
            >
              <Flex direction="column" gap={24} className="h-full">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextInput
                        {...field}
                        label="Email"
                        placeholder="Email"
                        required
                        error={errors?.email?.message}
                        classNames={{
                          wrapper: 'mt-1',
                        }}
                      />
                    )
                  }}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PasswordInput
                        {...field}
                        label="Password"
                        placeholder="Password"
                        required
                        error={errors?.password?.message}
                        classNames={{
                          wrapper: 'mt-1',
                        }}
                      />
                    )
                  }}
                />

                <Button fullWidth type="submit" className="mt-auto">
                  Login
                </Button>
              </Flex>
            </Paper>
          </Flex>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default Login
