import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Grid,
  Group,
  List,
  Modal,
  Radio,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { Controller, FieldErrors, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import ForEach from '@/components/common/ForEach'
import { EventFormValues, eventSchema } from '@/components/shared/events/schema'
import useAuthContext from '@/hooks/use-auth-context'
import useEventContext from '@/hooks/use-event-context'
import { EventType, IEvent, ModalModeType, TModalMode } from '@/types/types'
import { categoryOptions } from '@/utils/constants'
import { getAvailableSlots } from '@/utils/utils'

type EventDialogProps = {
  open: boolean
  onClose: () => void
  mode: TModalMode | null
  selectedEvent: IEvent | null
  onSubmit: () => void
  startTransition: React.TransitionStartFunction
}

export const EventDialog: React.FC<EventDialogProps> = ({
  open,
  onClose,
  mode,
  selectedEvent,
  onSubmit,
  startTransition,
}) => {
  const { isReadMode, isEditMode, isCreateMode } = useMemo(
    () => ({
      isReadMode: mode === ModalModeType.VIEW,
      isEditMode: mode === ModalModeType.EDIT,
      isCreateMode: mode === ModalModeType.CREATE,
    }),
    [mode],
  )

  const { events, updateEvent, saveEvent } = useEventContext()
  const { user } = useAuthContext()

  const initialFormValues = useMemo(
    () => ({
      id: selectedEvent?.id,
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

  const checkConflictAndShowToast = (
    newEvent: EventFormValues,
    allEvents: IEvent[],
  ) => {
    const newStart = dayjs(newEvent.startDateTime)
    const newEnd = dayjs(newEvent.endDateTime)

    const eventsOnSameDay = allEvents?.filter((e) =>
      dayjs(e.startDateTime).isSame(newStart, 'day'),
    )

    const isOverlapping = eventsOnSameDay?.some((event) => {
      const existingStart = dayjs(event.startDateTime)
      const existingEnd = dayjs(event.endDateTime)
      return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)
    })

    if (isOverlapping) {
      const slots = getAvailableSlots(
        eventsOnSameDay || [],
        newStart.toISOString(),
      )

      toast.error(
        <Stack>
          <Text className="leading-5">
            The selected time overlaps with another event. please select from
            these available slots for the selected date:
          </Text>
          <List>
            <ForEach
              of={slots || []}
              render={(el) => {
                return (
                  <List.Item>
                    <Text className="leading-none" key={`${el.from}-${el.to}`}>
                      {el.from} - {el.to}
                    </Text>
                  </List.Item>
                )
              }}
            />
          </List>
        </Stack>,
      )
      return true
    }

    return false
  }

  const successHandler = async (data: EventFormValues) => {
    const isConflict = checkConflictAndShowToast(data, events || [])

    if (isConflict) return

    if (isCreateMode) {
      const newEvent = {
        ...data,
        id: uuidv4(),
      }
      startTransition(() => {
        saveEvent(newEvent)
      })
      toast.success('Event created successfully.')
    }

    if (isEditMode) {
      const updatedEvent = {
        ...data,
        id: selectedEvent?.id || '',
        organizer: data?.organizer,
      }
      startTransition(() => {
        updateEvent(updatedEvent)
      })
      toast.success('Event updated successfully.')
    }
    onSubmit()
  }

  const errorHandler = (errors: FieldErrors) => {
    console.log(errors)
  }

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
        body: 'p-0 h-[30rem] overflow-y-auto',
      }}
    >
      <Modal.Body className="p-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(successHandler, errorHandler)}>
            <Stack gap={12}>
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
                    {isCreateMode ? 'Create' : 'Save Event'}
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
