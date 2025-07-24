import { Flex, Stack } from '@mantine/core'
import { DataTable, DataTableColumn } from 'mantine-datatable'
import React, { useMemo, useState } from 'react'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'

import useEventContext from '@/hooks/use-event-context'
import { IEvent, TModalMode } from '@/types/types'

import { EventDialog } from './EventDialog'

interface IModalState {
  open: boolean
  mode: TModalMode | null
}

const Events: React.FC = () => {
  const { events, deleteEvent } = useEventContext()
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null)
  const [modalState, setModalState] = useState<IModalState>({
    open: false,
    mode: null,
  })
  const [isLoading, setIsLoading] = useState(false)

  const actionClickHandler = (mode: TModalMode, record: IEvent) => {
    setSelectedEvent(record)
    setModalState({
      open: true,
      mode,
    })
  }

  const tableColumns = useMemo(
    (): DataTableColumn<IEvent>[] => [
      { title: 'Title', accessor: 'title' },
      { title: 'Description', accessor: 'description' },
      { title: 'Category', accessor: 'category' },
      { title: 'Type', accessor: 'eventType' },
      { title: 'Location', accessor: 'location' },
      {
        title: 'Event Start Time',
        accessor: 'startDateTime',
        render: (row) =>
          row.startDateTime
            ? new Date(row.startDateTime).toLocaleString()
            : '-',
      },
      {
        title: 'Event End Time',
        accessor: 'endDateTime',
        render: (row) =>
          row.endDateTime ? new Date(row.endDateTime).toLocaleString() : '-',
      },
      {
        title: 'Organizer',
        accessor: 'organizer',
        render: (row) => row.organizer.user_name,
      },
      {
        title: 'Actions',
        accessor: 'actions',
        render: (record) => (
          <Flex justify="center" gap="md">
            <FaEye
              id="read"
              className="cursor-pointer"
              title="Read"
              fill="#014778"
              size={16}
              onClick={() => actionClickHandler('read', record)}
            />
            <FaEdit
              id="edit"
              className="cursor-pointer"
              title="Edit"
              fill="#014778"
              size={16}
              onClick={() => actionClickHandler('edit', record)}
            />
            <FaTrash
              className="cursor-pointer"
              title="Delete"
              fill="#014778"
              size={16}
              onClick={() => deleteEvent(record?.id)}
            />
          </Flex>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <Stack>
        <DataTable
          withTableBorder={true}
          mih={500}
          borderRadius="lg"
          striped="odd"
          records={events ?? []}
          columns={tableColumns}
          totalRecords={events?.length}
          recordsPerPage={10}
          page={1}
          onPageChange={() => {}}
          fetching={isLoading}
          pinFirstColumn
          defaultColumnProps={{
            textAlign: 'center',
          }}
          withColumnBorders
          highlightOnHover
        />
      </Stack>
      <EventDialog
        open={modalState.open}
        onClose={() => {
          setModalState({
            open: false,
            mode: null,
          })
          setSelectedEvent(null)
        }}
        mode={modalState.mode}
        selectedEvent={selectedEvent}
        onSubmit={() => {
          setModalState({
            open: false,
            mode: null,
          })
          setSelectedEvent(null)
        }}
      />
    </>
  )
}

export default Events
