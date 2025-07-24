import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Grid,
  Group,
  Modal,
  Radio,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { Controller, FieldErrors, FormProvider, useForm } from 'react-hook-form'

import { EventFormValues, eventSchema } from '@/components/shared/events/schema'
import useAuthContext from '@/hooks/use-auth-context'
import useEventContext from '@/hooks/use-event-context'
import { EventType, IEvent, TModalMode } from '@/types/types'
import { categoryOptions } from '@/utils/constants'

type EventDialogProps = {
  open: boolean
  onClose: () => void
  mode: TModalMode | null
  selectedEvent: IEvent | null
  onSubmit: () => void
}

export const EventDialog: React.FC<EventDialogProps> = ({
  open,
  onClose,
  mode,
  selectedEvent,
  onSubmit,
}) => {
  const { isReadMode, isEditMode, isCreateMode } = useMemo(
    () => ({
      isReadMode: mode === 'read',
      isEditMode: mode === 'edit',
      isCreateMode: mode === 'create',
    }),
    [mode],
  )

  const { updateEvent, saveEvent } = useEventContext()
  const { user } = useAuthContext()

  const initialFormValues = useMemo(
    () => ({
      title: selectedEvent?.title || '',
      description: selectedEvent?.description || '',
      eventType: selectedEvent?.eventType || EventType.ONLINE,
      location: selectedEvent?.location || '',
      eventLink: selectedEvent?.eventLink || '',
      startDateTime: selectedEvent?.startDateTime
        ? dayjs(selectedEvent?.startDateTime).toISOString()
        : '',
      endDateTime: selectedEvent?.endDateTime
        ? dayjs(selectedEvent?.endDateTime).toISOString()
        : '',
      category: selectedEvent?.category || '',
      organizer: {
        user_name: user?.user_name || '',
        email: user?.email || '',
      },
    }),
    [selectedEvent, open],
  )

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    values: initialFormValues,
  })

  const { control, watch, handleSubmit, clearErrors } = methods

  const { eventType } = watch()

  const successHandler = async (data: EventFormValues) => {
    console.log(data, 'data------')
    if (isCreateMode) {
      const newEvent = {
        ...data,
        id: Date.now().toString(),
        organizer: data?.organizer,
      }
      saveEvent(newEvent)
    }

    if (isEditMode) {
      const updatedEvent = {
        ...data,
        id: selectedEvent?.id || '',
        organizer: data?.organizer,
      }
      updateEvent(updatedEvent)
    }
    onSubmit()
  }

  const errorHandler = (errors: FieldErrors) => {}

  return (
    <Modal
      opened={open}
      onClose={onClose}
      size={'xl'}
      centered
      title={
        isCreateMode
          ? 'Create Event'
          : isEditMode
            ? 'Edit Event'
            : 'Event Details'
      }
      classNames={{
        content: 'rounded-xl',
        header: 'border border-b',
        body: 'p-0',
      }}
    >
      <Modal.Body>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(successHandler, errorHandler)}>
            <Stack gap={12} className="p-4">
              <Grid>
                <Grid.Col span={12} className="pt-0">
                  <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextInput
                        label="Title"
                        {...field}
                        disabled={isReadMode}
                        error={fieldState.error?.message}
                        classNames={{
                          label: 'mb-1',
                        }}
                        withAsterisk
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Textarea
                        resize="both"
                        label="Description"
                        {...field}
                        rows={4}
                        disabled={isReadMode}
                        error={fieldState.error?.message}
                        classNames={{
                          label: 'mb-1',
                        }}
                        withAsterisk
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>

              <Controller
                name="eventType"
                control={control}
                render={({ field: { value, onChange }, fieldState }) => (
                  <Radio.Group
                    label="Event Type:"
                    value={value}
                    onChange={(value) => {
                      onChange(value)
                      if (value === EventType.ONLINE) {
                        clearErrors('location')
                      }
                      if (value === EventType.IN_PERSON) {
                        clearErrors('eventLink')
                      }
                    }}
                    error={fieldState.error?.message}
                    readOnly={isReadMode}
                    classNames={{
                      label: 'mb-2',
                    }}
                    withAsterisk
                  >
                    <Group>
                      <Radio value={EventType.ONLINE} label="Online" />
                      <Radio value={EventType.IN_PERSON} label="In Person" />
                    </Group>
                  </Radio.Group>
                )}
              />

              <Grid>
                <Grid.Col span={6}>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextInput
                        label="Location"
                        {...field}
                        disabled={isReadMode}
                        error={fieldState.error?.message}
                        classNames={{
                          label: 'mb-1',
                        }}
                        withAsterisk={eventType === EventType.IN_PERSON}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Controller
                    name="eventLink"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextInput
                        label="Event Link"
                        {...field}
                        disabled={isReadMode}
                        classNames={{
                          label: 'mb-1',
                        }}
                        error={fieldState.error?.message}
                        withAsterisk={eventType === EventType.ONLINE}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <Controller
                    name="startDateTime"
                    control={control}
                    render={({ field: { value, onChange }, fieldState }) => (
                      <DateTimePicker
                        label="Start Date/Time"
                        value={value ? dayjs(value).toDate() : null}
                        onChange={(val) =>
                          onChange(val ? dayjs(val).toISOString() : '')
                        }
                        disabled={isReadMode}
                        timePickerProps={{
                          withDropdown: true,
                          popoverProps: { withinPortal: false },
                          format: '12h',
                        }}
                        classNames={{
                          label: 'mb-1',
                        }}
                        error={fieldState.error?.message}
                        withAsterisk
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Controller
                    name="endDateTime"
                    control={control}
                    render={({ field: { value, onChange }, fieldState }) => (
                      <DateTimePicker
                        label="End Date/Time"
                        value={value ? dayjs(value).toDate() : null}
                        onChange={(val) =>
                          onChange(val ? dayjs(val).toISOString() : '')
                        }
                        disabled={isReadMode}
                        timePickerProps={{
                          withDropdown: true,
                          popoverProps: { withinPortal: false },
                          format: '12h',
                        }}
                        classNames={{
                          label: 'mb-1',
                        }}
                        withAsterisk
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        label="Category"
                        data={categoryOptions}
                        {...field}
                        disabled={isReadMode}
                        classNames={{
                          label: 'mb-1',
                        }}
                        withAsterisk
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Controller
                    name="organizer.user_name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextInput
                        label="Organizer"
                        {...field}
                        disabled={true}
                        classNames={{
                          label: 'mb-1',
                        }}
                        withAsterisk
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid.Col>
              </Grid>

              {(isCreateMode || isEditMode) && (
                <Group justify="space-between" className="mt-4">
                  <Button bg="gray" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isCreateMode ? 'Create Event' : 'Save Event'}
                  </Button>
                </Group>
              )}
            </Stack>
          </form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  )
}
