import { EventType } from "@/types/types";
import dayjs from "dayjs";
import z from "zod"

const eventTypeEnum = z.enum([EventType.ONLINE, EventType.IN_PERSON]);

export const eventSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    eventType: eventTypeEnum,
    location: z.string().optional().or(z.literal('')),
    eventLink: z.string().optional().or(z.literal('')),
    startDateTime: z
        .string()
        .min(1, 'Start date/time is required')
        .refine((val) => dayjs(val).isValid(), {
            message: 'Start date/time must be a valid date',
        }),
    endDateTime: z
        .string()
        .min(1, 'End date/time is required')
        .refine((val) => dayjs(val).isValid(), {
            message: 'End date/time must be a valid date',
        }),
    category: z.string().min(1, 'Category is required'),
    organizer: z.object({
        user_name: z.string().min(1, 'Organizer is required'),
        email: z.string().email(),
    }),
}).superRefine((data, ctx) => {
    // If event is in-person, location is required
    if (data.eventType === EventType.IN_PERSON && !data.location?.trim()) {
        ctx.addIssue({
            path: ['location'],
            code: "custom",
            message: 'Location is required for in person events',
        });
    }

    // If event is online, eventLink is required
    if (data.eventType === EventType.ONLINE && !data.eventLink?.trim()) {
        ctx.addIssue({
            path: ['eventLink'],
            code: "custom",
            message: 'Event link is required for online events',
        });
    }

    // Ensure end date is after start date
    const start = new Date(data.startDateTime);
    const end = new Date(data.endDateTime);
    if (start && end && end <= start) {
        ctx.addIssue({
            path: ['endDateTime'],
            code: "custom",
            message: 'Event End date/time must be after start date/time',
        });
    }
});

export type EventFormValues = z.infer<typeof eventSchema>
