import { IEvent } from "@/types/types"
import dayjs from "dayjs"

export const capitalizeFirstLetter = (str: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

export const getAvailableSlotsForRange = (
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    events: IEvent[]
) => {
    const slots: { date: string; from: string; to: string }[] = []

    let current = startDate.startOf('day')

    while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
        const dayStart = current.startOf('day')
        const dayEnd = current.endOf('day')

        const eventsOnDay = events.filter((event) => {
            const eventStart = dayjs(event.startDateTime)
            const eventEnd = dayjs(event.endDateTime)

            // Check if event overlaps with current day
            return eventStart.isBefore(dayEnd) && eventEnd.isAfter(dayStart)
        })

        const sorted = eventsOnDay.sort(
            (a, b) =>
                dayjs(a.startDateTime).valueOf() - dayjs(b.startDateTime).valueOf()
        )

        let lastEnd = dayStart

        for (const event of sorted) {
            const currentStart = dayjs(event.startDateTime).isBefore(dayStart)
                ? dayStart
                : dayjs(event.startDateTime)

            const currentEnd = dayjs(event.endDateTime).isAfter(dayEnd)
                ? dayEnd
                : dayjs(event.endDateTime)

            if (currentStart.isAfter(lastEnd)) {
                slots.push({
                    date: current.format('DD/MM/YYYY'),
                    from: lastEnd.format('hh:mm A'),
                    to: currentStart.format('hh:mm A'),
                })
            }

            if (currentEnd.isAfter(lastEnd)) {
                lastEnd = currentEnd
            }
        }

        if (lastEnd.isBefore(dayEnd)) {
            slots.push({
                date: current.format('DD/MM/YYYY'),
                from: lastEnd.format('hh:mm A'),
                to: dayEnd.format('hh:mm A'),
            })
        }

        current = current.add(1, 'day')
    }

    return slots
}