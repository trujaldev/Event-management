import { useLocalStorage } from '@mantine/hooks'
import { PropsWithChildren } from 'react'

import { EventContext } from '@/hooks/use-event-context'
import { IEvent } from '@/types/types'

const EventsProvider = ({ children }: PropsWithChildren) => {
  const [events, setEvents, removeEventsFromLocalStorage] = useLocalStorage<
    IEvent[]
  >({
    key: 'events',
    defaultValue: [],
    getInitialValueInEffect: false,
  })

  const getEventById = (eventId: string) => {
    return events?.find((event) => event.id === eventId) ?? null
  }

  const saveEvent = (event: IEvent) => {
    setEvents((prev) => [...prev, event])
  }

  const saveMultipleEvents = (events: IEvent[]) => {
    setEvents((prev) => [...prev, ...events])
  }

  const updateEvent = (updatedEvent: IEvent) => {
    setEvents((prev) =>
      prev?.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    )
  }

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev?.filter((item) => item?.id !== eventId))
  }

  const clearLocalStorageEventKey = () => {
    removeEventsFromLocalStorage()
  }

  return (
    <EventContext.Provider
      value={{
        events,
        saveEvent,
        saveMultipleEvents,
        deleteEvent,
        updateEvent,
        getEventById,
        clearLocalStorageEventKey,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export default EventsProvider
