import { useEffect } from "react";
import { UseAuth } from "../../../Providers/AuthProvider";
import { UseEvents } from "../../../Providers/EventsProvider";
import { UseNav } from "../../../Providers/NavProvider";
import { UsePopUpModal } from "../../../Providers/PopUpModalProvider";
import { UseServices } from "../../../Providers/ServicesProvider";
import { Event, clientSchema } from "../../../utils/types";
import { ServiceCardsDisplay } from "../Services/ServiceCardsDisplay";
import { Global } from "../../../utils/GlobalVarsAndFuncs";

export const EventDetailsModal = ({
  exitModal,
  fadeIn,
  displayedEvent,
}: {
  exitModal: () => void;
  fadeIn: boolean;
  displayedEvent: Event;
}) => {
  const { navigate, navUrls } = UseNav();
  const { getServiceFromId } = UseServices();
  const { populateEventDetails, setEventBeingEdited, updateEvent } =
    UseEvents();
  const { currentUser, getUserFromId } = UseAuth();
  const { exitPopUpModal, triggerPopUpModal } = UsePopUpModal();

  const {
    status,
    location,
    clientId,
    date,
    time,
    outdoors,
    numberOfGuests,
    minGuestAge,
    maxGuestAge,
    selectedServicesIds,
    selectedServicesPrices,
    selectedServicesDurations,
    notes,
  } = displayedEvent;
  const totalCost = selectedServicesPrices.reduce((acc, curr) => acc + curr, 0);
  const totalDuration = selectedServicesDurations.reduce(
    (acc, curr) => acc + curr,
    0
  );
  const selectedServices = selectedServicesIds.map((serviceId) =>
    getServiceFromId(serviceId)
  );
  const eventLocation = location.split("_");
  const address = eventLocation[0];
  const city = eventLocation[1];
  const state = eventLocation[2];

  const client =
    clientId > -1
      ? clientSchema.parse(getUserFromId(clientId))
      : Global.emptyClientUser;
  const isClient = currentUser.accountType === "Client";

  const paidOrCompletedEventsCannotBeEditedWarning = () => {
    triggerPopUpModal(
      'Events in the "paid" or "completed" status cannot be edited. Please contact the service provider(s) for more info.',
      [
        {
          type: "button",
          children: "Ok",
          onClick: () => {
            exitPopUpModal();
          },
        },
      ]
    );
  };

  const irreversibleEventStatusUpdateWarning = () => {
    triggerPopUpModal(
      "Changing an event's status cannot be undone. Do you wish to continue?",
      [
        {
          type: "button",
          children: "Yes",
          onClick: () => {
            exitPopUpModal();
            exitModal();
            updateEvent({ ...displayedEvent, status: "paid" });
          },
        },
        {
          type: "button",
          children: "No",
          onClick: () => {
            exitPopUpModal();
          },
        },
      ]
    );
  };

  const automaticEventStatusUpdateWarning = () => {
    triggerPopUpModal(
      "Once an event is in the paid status and the date is passed, it will automatically move to completed. Changing an event's status cannot be undone. Do you wish to continue?",
      [
        {
          type: "button",
          children: "Yes",
          onClick: () => {
            exitPopUpModal();
            exitModal();
            updateEvent({
              ...displayedEvent,
              status: "completed",
            });
          },
        },
        {
          type: "button",
          children: "No",
          onClick: () => {
            exitPopUpModal();
          },
        },
      ]
    );
  };

  useEffect(() => {}, [displayedEvent]);

  return (
    <section
      onClick={() => {
        exitModal();
      }}
      className={`modal-background ${fadeIn ? "fade-in" : "fade-out"}`}
    >
      <div
        className={`event-details-modal ${fadeIn ? "slide-in" : "slide-out"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modalX"
          onClick={() => {
            exitModal();
          }}
        >
          <i className="fa-solid fa-x"></i>
        </div>
        <div className="event-details-modal-title">
          <h2>Event Details</h2>
          <span>Status: {status}</span>
        </div>
        <div className="white-overlay">
          <table className="event-details-list">
            <tbody>
              {!isClient && (
                <>
                  <tr>
                    <td>Client Name:</td>{" "}
                    <td>
                      {client.firstName} {client.lastName}
                    </td>
                  </tr>
                  <tr>
                    <td>Phone:</td> <td>{client.phone}</td>
                  </tr>
                  <tr>
                    <td>Email:</td> <td>{client.email}</td>
                  </tr>
                </>
              )}
              <tr>
                <td>Date:</td> <td>{date}</td>
              </tr>
              <tr>
                <td>Time:</td> <td>{time[0] === "0" ? time.slice(1) : time}</td>
              </tr>
              <tr>
                <td>Location:</td>{" "}
                <td>
                  {address} {city}, {state}
                </td>
              </tr>
              <tr>
                <td>Number of Guests:</td> <td>{numberOfGuests}</td>
              </tr>
              <tr>
                <td>Age Range:</td>{" "}
                <td>
                  {minGuestAge} to {maxGuestAge}
                </td>
              </tr>
              <tr>
                <td>Outdoors:</td>
                <td>{outdoors ? "yes" : "no"}</td>
              </tr>
              <tr>
                <td>Notes:</td>
                <td>{notes}</td>
              </tr>
            </tbody>
          </table>

          <table className="event-totals">
            <tbody>
              <tr>
                <th>Service</th>
                <th>Duration</th>
                <th>Cost</th>
              </tr>
              {selectedServices.map((service, index) => {
                const serviceDuration = selectedServicesDurations[index];
                const servicePrice = selectedServicesPrices[index];
                return (
                  <tr key={index}>
                    <td>{service.title}</td>
                    <td>
                      {serviceDuration} {serviceDuration === 1 ? "hr" : "hrs"}
                    </td>
                    <td>${servicePrice}</td>
                  </tr>
                );
              })}
              <tr>
                <td>Subtotal: </td>
                <td>
                  {totalDuration + (totalDuration === 1 ? " hr" : " hrs")}
                </td>
                <td>${totalCost}</td>
              </tr>
            </tbody>
          </table>

          <div className="event-services-display">
            <h3>Selected Services:</h3>
            <ServiceCardsDisplay
              servicesArray={selectedServices}
              showFilterOptions={false}
            />
          </div>

          {isClient && (
            <button
              type="button"
              onClick={() => {
                if (status !== "booked") {
                  paidOrCompletedEventsCannotBeEditedWarning();
                } else {
                  navigate(navUrls.scheduleEvent);
                  populateEventDetails(displayedEvent);
                  sessionStorage.setItem(
                    "eventBeingEdited",
                    JSON.stringify(displayedEvent)
                  );
                  setEventBeingEdited(displayedEvent);
                }
              }}
            >
              Edit
            </button>
          )}

          {!isClient && status === "booked" && (
            <button
              type="button"
              onClick={() => {
                irreversibleEventStatusUpdateWarning();
              }}
            >
              Mark Paid
            </button>
          )}

          {!isClient && status === "paid" && (
            <>
              <button
                type="button"
                onClick={() => {
                  automaticEventStatusUpdateWarning();
                }}
              >
                Mark Completed
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
