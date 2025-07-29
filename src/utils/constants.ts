import { EventType } from "@/types/types"

export const categoryOptions = [
    { value: 'tech', label: 'Tech' },
    { value: 'business', label: 'Business' },
    { value: 'design', label: 'Design' },
    { value: 'other', label: 'Other' },
]

export const eventTypeOptions = [
    { value: EventType.ONLINE, label: 'Online' },
    { value: EventType.IN_PERSON, label: 'In Person' },
]