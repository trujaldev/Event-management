import { IEvent } from "@/types/types"
import dayjs from "dayjs"

export const capitalizeFirstLetter = (str: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

export const getAvailableSlots = (eventsOnDay: IEvent[], date: string) => {
    const startOfDay = dayjs(date).startOf('day')
    const endOfDay = dayjs(date).endOf('day')

    const sorted =
        eventsOnDay
            ?.slice()
            ?.sort(
                (a, b) =>
                    dayjs(a.startDateTime).valueOf() - dayjs(b.startDateTime).valueOf(),
            ) || []

    const slots: { from: string; to: string }[] = []

    let lastEnd = startOfDay

    for (const event of sorted) {
        const currentStart = dayjs(event.startDateTime)
        const currentEnd = dayjs(event.endDateTime)

        // If there's a gap between lastEnd and currentStart
        if (currentStart.isAfter(lastEnd)) {
            slots.push({
                from: lastEnd.format('hh:mm A'),
                to: currentStart.format('hh:mm A'),
            })
        }

        // Update lastEnd to the later of lastEnd and currentEnd
        if (currentEnd.isAfter(lastEnd)) {
            lastEnd = currentEnd
        }
    }

    // If there's time remaining after the last event
    if (lastEnd.isBefore(endOfDay)) {
        slots.push({
            from: lastEnd.format('hh:mm A'),
            to: endOfDay.format('hh:mm A'),
        })
    }

    return slots
}