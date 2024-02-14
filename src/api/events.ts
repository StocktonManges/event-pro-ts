import { Global } from "../utils/GlobalVarsAndFuncs";
import { Event, eventSchema } from "../utils/types";
import { Requests } from "./getData";

export const EventsRequests = {
  postEvent: (newEventInfo: Omit<Event, "id">): Promise<Event> =>
    fetch(`${Global.baseURL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEventInfo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create new event.");
        }
        return response.json();
      })
      .then((event) => eventSchema.parse(event)),

  patchEvent: (eventInfo: Event): Promise<Event> =>
    fetch(`${Global.baseURL}/events/${eventInfo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventInfo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update event.");
        }
        return response.json();
      })
      .then((event) => eventSchema.parse(event)),

  deleteEvent: (eventId: number): Promise<void> =>
    fetch(`${Global.baseURL}/events/${eventId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }
      return response.json();
    }),

  getCurrentClientEvents: (currentUserId: number): Promise<Event[]> =>
    Requests.fetchEvents().then((allEvents) =>
      allEvents.filter(({ clientId }) => clientId === currentUserId)
    ),
};
