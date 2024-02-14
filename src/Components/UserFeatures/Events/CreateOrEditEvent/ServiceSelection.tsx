import { UseEvents } from "../../../../Providers/EventsProvider";
import { ServiceCardsDisplay } from "../../Services/ServiceCardsDisplay";
import { UseNav } from "../../../../Providers/NavProvider";
import { useState } from "react";

export const ServiceSelection = () => {
  const { navigate, navUrls } = UseNav();
  const { filteredServicesForEvent } = UseEvents();
  const { matchingServices, mismatchingServices } = filteredServicesForEvent;
  const [viewingAvailable, setViewingAvailable] = useState<boolean>(true);

  return (
    <section className="service-selection">
      <div className="flex-container">
        <h1>Service Selection</h1>
        <div className="service-status-tabs">
          <div
            style={
              viewingAvailable ? { backgroundColor: "var(--light-green)" } : {}
            }
            onClick={() => {
              setViewingAvailable(true);
            }}
          >
            <span>Available Services</span>
          </div>
          <div
            style={!viewingAvailable ? { backgroundColor: "var(--coral)" } : {}}
            onClick={() => {
              setViewingAvailable(false);
            }}
          >
            <span>Unavailable Services</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          navigate(navUrls.scheduleEvent);
        }}
      >
        Back to Booking Form
      </button>
      <h4>
        **These services are filtered based on your current event details.
      </h4>
      <ServiceCardsDisplay
        servicesArray={
          viewingAvailable ? matchingServices : mismatchingServices
        }
        showFilterOptions={true}
      />
    </section>
  );
};
