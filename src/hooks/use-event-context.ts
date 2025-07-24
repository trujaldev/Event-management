import { IEvent } from "@/types/types";
import { createContext, useContext } from "react";

export interface EventContextType {
    events: IEvent[] | null
    saveEvent: (event: IEvent) => void
    saveMultipleEvents: (event: IEvent[]) => void
    clearLocalStorageEventKey: () => void
    deleteEvent: (eventId: string) => void
    updateEvent: (event: IEvent) => void
    getEventById: (eventId: string) => IEvent | null
}

export const EventContext = createContext<EventContextType | null>(null);

const useEventContext = () => {
    const context = useContext(EventContext);

    if (!context) {
        throw new Error("useEventContext must be used within an EventsDataProvider");
    }

    return context;
};

export default useEventContext;
