import { Button, Group, Select, Stack, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import dayjs from 'dayjs'
import qs from 'query-string'
import React, { useEffect, useMemo, useState } from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { EventType, IEventFilters, TDateRange, TModalMode } from '@/types/types'
import { categoryOptions, eventTypeOptions } from '@/utils/constants'

interface EventTableHeaderProps {
  startTransition: React.TransitionStartFunction
  onCreateEvent: (mode: TModalMode) => void
}

const initialFilters: IEventFilters = {
  search: '',
  eventType: null,
  category: '',
  sortKey: '',
  sortDir: '',
  dateRange: [null, null],
}

const EventTableHeader: React.FC<EventTableHeaderProps> = ({
  startTransition,
  onCreateEvent,
}) => {
  const [filters, setFilters] = useState<IEventFilters>(initialFilters)
  const location = useLocation()
  const navigate = useNavigate()

  const { search, eventType, category, dateRange } = filters

  const onSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }))
  }

  const onDropdownChange = (key: keyof IEventFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const onDateRangeChange = (value: TDateRange) => {
    setFilters((prev) => ({ ...prev, dateRange: value }))
  }

  const [_, setParams] = useSearchParams({
    search: '',
    eventType: '',
    category: '',
    sortKey: '',
    sortDir: '',
    dateRange: ['', ''],
  })

  const parsedUrlData = useMemo(
    () => qs.parse(location.search),
    [location.search],
  )

  useEffect(() => {
    const start = parsedUrlData.startDate
      ? dayjs(parsedUrlData.startDate as string).format('YYYY-MM-DD')
      : null
    const end = parsedUrlData.endDate
      ? dayjs(parsedUrlData.endDate as string).format('YYYY-MM-DD')
      : null

    startTransition(() => {
      setFilters({
        search: (parsedUrlData.search as string) || '',
        eventType: (parsedUrlData.eventType as EventType) || null,
        category: (parsedUrlData.category as string) || '',
        sortKey: (parsedUrlData.sortKey as string) || '',
        sortDir: (parsedUrlData.sortDir as string) || '',
        dateRange: [start, end],
      })
    })
  }, [parsedUrlData])

  const handleApplyFilters = () => {
    const query: Record<string, string> = {}

    if (filters.search) query.search = filters.search
    if (filters.eventType) query.eventType = filters.eventType
    if (filters.category) query.category = filters.category
    if (filters.sortKey) query.sortKey = filters.sortKey
    if (filters.sortDir) query.sortDir = filters.sortDir
    if (filters.dateRange[0]) query.startDate = filters.dateRange[0]
    if (filters.dateRange[1]) query.endDate = filters.dateRange[1]

    const queryString = qs.stringify(query)

    startTransition(() => {
      setParams(queryString)
    })
    navigate({ search: queryString })
  }

  const handleClearFilters = () => {
    startTransition(() => {
      setFilters(initialFilters)
      setParams({})
    })
  }

  return (
    <Stack gap="sm" pb="xl" w="100%">
      <Group align="end" gap="md" justify="space-between" wrap="wrap">
        <TextInput
          leftSection={<FaSearch />}
          rightSection={
            search ? (
              <Button
                variant="subtle"
                size="xs"
                onClick={() => {
                  onSearchChange('')
                  setParams((prev) => ({ ...prev, search: '' }))
                }}
                p={0}
              >
                <IoMdClose size={16} />
              </Button>
            ) : null
          }
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApplyFilters()
            }
          }}
          w={430}
        />
        <Button
          variant="gradient"
          leftSection={<FaPlus />}
          color="blue"
          onClick={() => onCreateEvent('create')}
        >
          Create Event
        </Button>
      </Group>
      <Group align="end" justify="space-between" wrap="wrap">
        <Group>
          <Select
            placeholder="Event Type"
            data={eventTypeOptions}
            key={eventType}
            value={eventType}
            onChange={(value) => onDropdownChange('eventType', value || '')}
            classNames={{
              label: 'mb-1',
            }}
          />
          <Select
            placeholder="Category"
            data={categoryOptions}
            key={category}
            value={category}
            onChange={(value) => onDropdownChange('category', value || '')}
            classNames={{
              label: 'mb-1',
            }}
          />
          <DatePickerInput
            miw={220}
            clearable
            type="range"
            placeholder="Date Range"
            allowSingleDateInRange
            value={dateRange}
            onChange={(value) => {
              onDateRangeChange(value)
            }}
            classNames={{
              label: 'mb-1',
            }}
          />
        </Group>
        <Group>
          <Button variant="outline" onClick={handleApplyFilters} color="blue">
            Apply Filters
          </Button>
          <Button variant="outline" color="red" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Group>
      </Group>
    </Stack>
  )
}

export default EventTableHeader
