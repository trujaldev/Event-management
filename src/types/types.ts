import { TAuthenticatedUser } from "@/types/schemaTypes"

export enum BreakPointsSize {
    DESKTOP = 'desktop',
    LAPTOP = 'laptop',
    TABLET = 'tablet',
    MOBILE = 'mobile',
    MAX_TABLET = 'maxTablet',
    MAX_LAPTOP = 'maxLaptop',
    DEFAULT = 'default'
}

export enum EventType {
    ONLINE = 'online',
    IN_PERSON = 'in_person'
}

export interface IEvent {
    id: string
    title: string
    description: string
    eventType: EventType
    location?: string
    eventLink?: string
    startDateTime: string
    endDateTime: string
    category: string
    organizer: TAuthenticatedUser
}

export type TModalMode = 'create' | 'edit' | 'read'