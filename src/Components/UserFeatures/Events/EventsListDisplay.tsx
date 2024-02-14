import { useState } from "react";
import { EventDetailsModal } from "./EventDetailsModal";
import { Event } from "../../../utils/types";
import { Global } from "../../../utils/GlobalVarsAndFuncs";
import { UseAuth } from "../../../Providers/AuthProvider";

export const EventsListDisplay = ({
  eventsArray,
}: {
  eventsArray: Event[];
}) => {
  const { currentUser, getUserFromId } = UseAuth();
  const [displayedEvent, setDisplayedEvent] = useState<Event>(
    Global.emptyEvent
  );
  const [fadeIn, setFadeIn] = useState<boolean>(false);

  const isClient = currentUser.accountType === "Client";

  const exitModal = () => {
    setFadeIn(false);
    // This timeout function needs to match the .slide-out animation time.
    setTimeout(() => {
      setDisplayedEvent(Global.emptyEvent);
    }, 1000);
  };

  // Compares date objects and puts them in chronological order.
  const compareDates = (
    a: { date: Date; event: Event },
    b: { date: Date; event: Event }
  ) => {
    const dateA = a.date;
    const dateB = b.date;
    if (dateA.valueOf() === dateB.valueOf()) {
      return -1;
    }
    return dateB.valueOf() - dateA.valueOf();
  };

  // Returns an array of events in chronological order.
  const sortEvents = (eventsArr: Event[]) =>
    eventsArr
      .map((event) => {
        return { date: Global.createDateObjectFromEvent(event), event };
      })
      .sort(compareDates)
      .map((obj) => obj.event);

  return (
    <div className="events-list-display">
      <ul>
        <li>
          {!isClient && <span>Client Name</span>}
          <span>Date</span>
          <span>Time</span>
          <span>Price</span>
          <span>Status</span>
        </li>
        {sortEvents(eventsArray).map((event, index) => {
          const { date, time, status, clientId } = event;
          const totalPrice = event.selectedServicesPrices.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const client = getUserFromId(clientId);
          const clientName = client.firstName + " " + client.lastName;

          return (
            <li
              className="event-quick-details"
              key={index}
              onClick={() => {
                if (displayedEvent.id === -1) {
                  setDisplayedEvent(event);
                  setFadeIn(true);
                }
              }}
            >
              {!isClient && <span>{clientName}</span>}
              <span>{date}</span>
              <span>{time[0] === "0" ? time.slice(1) : time}</span>
              <span>${totalPrice}.00</span>
              <span>{status}</span>
            </li>
          );
        })}
      </ul>
      <EventDetailsModal
        exitModal={exitModal}
        fadeIn={fadeIn}
        displayedEvent={displayedEvent}
      />
    </div>
  );
};
