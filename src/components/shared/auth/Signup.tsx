import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import React from 'react'
import { Controller, FieldErrors, FormProvider, useForm } from 'react-hook-form'

import BackButton from '@/components/common/BackButton'
import { signUpFormSchema } from '@/components/shared/auth/schema'
import { TSignUpForm } from '@/types/schemaTypes'

const Signup: React.FC = () => {
  const formMethods = useForm<TSignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    values: {
      user_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    mode: 'onChange',
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = formMethods

  const successHandler = async (data: TSignUpForm) => {}

  const errorHandler = (errors: FieldErrors) => {
    console.log(errors)
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(successHandler, errorHandler)}
        className={'h-full bg-alt-white-1'}
      >
        <Stack className="flex flex-col items-center p-4 w-full h-full">
          <Flex direction="column" className="w-full px-4 m-auto max-w-[35rem]">
            <Group gap={16} display="flex" align="center" justify="flex-start">
              <BackButton />

              <Title ta="center" className="text-alt-dark-1">
                Sign Up, It’s Quick!
              </Title>
            </Group>

            <Paper withBorder shadow="md" p={30} mt={24} radius="md">
              <Stack>
                <Controller
                  name="user_name"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextInput
                        {...field}
                        label="Name"
                        placeholder="User Name"
                        required
                        error={errors?.user_name?.message}
                        classNames={{
                          wrapper: 'mt-1',
                        }}
                      />
                    )
                  }}
                />

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

                <Controller
                  name="confirm_password"
                  control={control}
                  render={({ field }) => {
                    return (
                      <PasswordInput
                        {...field}
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        required
                        error={errors?.confirm_password?.message}
                        classNames={{
                          wrapper: 'mt-1',
                        }}
                      />
                    )
                  }}
                />

                <Button fullWidth type="submit">
                  Sign Up
                </Button>
              </Stack>
            </Paper>
          </Flex>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default Signup
