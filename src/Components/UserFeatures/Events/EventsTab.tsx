import { UseAuth } from "../../../Providers/AuthProvider";
import { UseEvents } from "../../../Providers/EventsProvider";
import { UseNav } from "../../../Providers/NavProvider";
import { EventsListDisplay } from "./EventsListDisplay";

export const EventsTab = () => {
  const { currentUser } = UseAuth();
  const { navigate, navUrls } = UseNav();
  const {
    currentProviderEvents,
    currentClientEvents,
    resetCreateOrEditEventForm,
  } = UseEvents();

  const eventStatusOptions = [
    { title: "Booked Events", status: "booked" },
    { title: "Paid Events", status: "paid" },
    { title: "Completed Events", status: "completed" },
  ];

  const isClient = currentUser.accountType === "Client";

  const eventsToDisplay = isClient
    ? [...currentClientEvents]
    : [...currentProviderEvents];

  return (
    <section className="events-tab flex-container">
      {isClient && (
        <button
          onClick={() => {
            navigate(navUrls.scheduleEvent);
            resetCreateOrEditEventForm();
          }}
        >
          Book Event
        </button>
      )}
      {eventStatusOptions.map(({ title, status }, index) => {
        const eventsFilteredByStatus = eventsToDisplay.filter(
          (event) => event.status === status
        );

        return (
          <div key={index} className={`${status}-events`}>
            <h3>{title}</h3>
            <EventsListDisplay eventsArray={eventsFilteredByStatus} />
          </div>
        );
      })}
    </section>
  );
};
