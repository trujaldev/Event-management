import { Flex, Stack } from '@mantine/core'
import dayjs from 'dayjs'
import {
  DataTable,
  DataTableColumn,
  DataTableSortStatus,
} from 'mantine-datatable'
import qs from 'query-string'
import React, { useMemo, useState, useTransition } from 'react'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import EventTableHeader from '@/components/shared/events/EventTableHeader'
import useEventContext from '@/hooks/use-event-context'
import { EventType, IEvent, TModalMode } from '@/types/types'
import { capitalizeFirstLetter } from '@/utils/utils'

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

  const [isPending, startTransition] = useTransition()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const location = useLocation()

  const filters = useMemo(() => {
    const parsedUrlData = qs.parse(location.search)

    return {
      search: (parsedUrlData.search as string) || '',
      eventType: (parsedUrlData.eventType as string) || '',
      category: (parsedUrlData.category as string) || '',
      sortKey: (parsedUrlData.sortKey as string) || '',
      sortDir: (parsedUrlData.sortDir as string) || '',
      startDate: parsedUrlData.startDate
        ? dayjs(parsedUrlData.startDate as string)
        : null,
      endDate: parsedUrlData.endDate
        ? dayjs(parsedUrlData.endDate as string)
        : null,
    }
  }, [location.search])

  const [sortStatus, setSortStatus] =
    useState<DataTableSortStatus<IEvent> | null>(null)

  const filteredEvents = useMemo(() => {
    if (!events) return []

    return events
      .filter((event) => {
        if (
          filters?.search &&
          !event?.title
            ?.toLowerCase()
            .includes(filters?.search?.toLowerCase()) &&
          !event?.description
            ?.toLowerCase()
            .includes(filters?.search?.toLowerCase())
        )
          return false

        if (
          filters?.eventType &&
          event?.eventType?.toLowerCase() !== filters?.eventType?.toLowerCase()
        )
          return false
        if (
          filters?.category &&
          event?.category?.toLowerCase() !== filters?.category?.toLowerCase()
        )
          return false

        if (
          filters?.startDate &&
          dayjs(event?.startDateTime).isBefore(filters?.startDate, 'day')
        )
          return false
        if (
          filters?.endDate &&
          dayjs(event?.endDateTime).isAfter(filters?.endDate, 'day')
        )
          return false

        return true
      })
      .sort((a, b) => {
        if (!sortStatus?.columnAccessor) return 0
        const key = sortStatus?.columnAccessor as keyof IEvent

        const aVal = a[key]
        const bVal = b[key]

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          if (dayjs(aVal).isValid() && dayjs(bVal).isValid()) {
            const aTime = dayjs(aVal).valueOf()
            const bTime = dayjs(bVal).valueOf()
            return sortStatus.direction === 'desc'
              ? bTime - aTime
              : aTime - bTime
          }

          return sortStatus?.direction === 'desc'
            ? bVal.localeCompare(aVal)
            : aVal.localeCompare(bVal)
        }

        return 0
      })
  }, [events, filters, sortStatus])

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredEvents.slice(startIndex, startIndex + pageSize)
  }, [filteredEvents, currentPage])

  const handlePageChange = (page: number) => {
    startTransition(() => {
      setCurrentPage(page)
    })
  }

  const actionClickHandler = (mode: TModalMode, record?: IEvent) => {
    setSelectedEvent(record ?? null)
    setModalState({
      open: true,
      mode,
    })
  }

  const tableColumns = useMemo(
    (): DataTableColumn<IEvent>[] => [
      { title: 'Title', accessor: 'title', sortable: true },
      { title: 'Description', accessor: 'description' },
      {
        title: 'Category',
        accessor: 'category',
        render: (row) => capitalizeFirstLetter(row.category),
      },
      {
        title: 'Type',
        accessor: 'eventType',
        render: (row) =>
          row?.eventType === EventType.ONLINE
            ? 'Online'
            : row?.eventType === EventType.IN_PERSON
              ? 'In Person'
              : '',
      },
      { title: 'Location', accessor: 'location' },
      {
        title: 'Event Start Time',
        accessor: 'startDateTime',
        sortable: true,
        width: 180,
        render: (row) =>
          row.startDateTime
            ? dayjs(row.startDateTime).format('DD/MM/YYYY hh:mm A')
            : '-',
      },
      {
        title: 'Event End Time',
        accessor: 'endDateTime',
        width: 180,
        render: (row) =>
          row.endDateTime
            ? dayjs(row.endDateTime).format('DD/MM/YYYY hh:mm A')
            : '-',
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
              id="view"
              className="cursor-pointer"
              title="View"
              fill="#014778"
              size={16}
              onClick={() => actionClickHandler('view', record)}
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
              onClick={() => {
                deleteEvent(record?.id)
                toast.success('Event deleted successfully')
              }}
            />
          </Flex>
        ),
      },
    ],
    [],
  )

  const handleSortChange = (value: DataTableSortStatus<IEvent>) => {
    if (!sortStatus || sortStatus.columnAccessor !== value.columnAccessor) {
      // New column or initial click -> sort descending
      setSortStatus({ columnAccessor: value.columnAccessor, direction: 'desc' })
    } else if (sortStatus.direction === 'desc') {
      // Descending -> ascending
      setSortStatus({ columnAccessor: value.columnAccessor, direction: 'asc' })
    } else if (sortStatus.direction === 'asc') {
      // Ascending -> clear sort (null)
      setSortStatus(null)
    }
  }

  return (
    <>
      <EventTableHeader
        onCreateEvent={actionClickHandler}
        startTransition={startTransition}
      />
      <Stack>
        <DataTable
          withTableBorder={true}
          mih={500}
          borderRadius="lg"
          striped="odd"
          records={paginatedEvents ?? []}
          columns={tableColumns}
          totalRecords={filteredEvents?.length}
          recordsPerPage={pageSize}
          page={currentPage}
          onPageChange={handlePageChange}
          fetching={isPending}
          pinFirstColumn
          defaultColumnProps={{
            textAlign: 'center',
          }}
          onSortStatusChange={handleSortChange}
          withColumnBorders
          highlightOnHover
          // @ts-ignore
          sortStatus={sortStatus}
          defaultColumnRender={(row, _, accessor) => {
            const data = row[accessor as keyof IEvent] as string
            return data === null || data === undefined || data === ''
              ? '-'
              : data
          }}
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
        startTransition={startTransition}
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
