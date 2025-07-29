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

export enum ModalModeType {
    VIEW = 'view',
    EDIT = 'edit',
    CREATE = 'create'
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

export type TModalMode = 'create' | 'edit' | 'view'

export type TDateRange = [string | null, string | null]

export interface IEventFilters {
    search: string
    eventType: EventType | null
    category: string
    sortKey: string
    sortDir: string
    dateRange: TDateRange
}