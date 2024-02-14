import { UseEvents } from "../../../../Providers/EventsProvider";
import { UseNav } from "../../../../Providers/NavProvider";
import { UseServices } from "../../../../Providers/ServicesProvider";

export const SelectedServicesList = () => {
  const { navigate, navUrls } = UseNav();
  const { allServices, getServiceFromId } = UseServices();
  const { removeSelectedService, currentEventDetails } = UseEvents();
  const {
    selectedServicesDurations,
    selectedServicesIds,
    selectedServicesPrices,
  } = currentEventDetails;

  return (
    <>
      <div className="selected-services-list">
        <table>
          <tbody>
            <tr>
              <th>Service</th>
              <th>Price</th>
              <th>Duration</th>
              <th></th>
            </tr>
            {selectedServicesIds.map((selectedServiceId, index) => {
              const service = getServiceFromId(selectedServiceId);
              const serviceDuration = selectedServicesDurations[index];
              const servicePrice = selectedServicesPrices[index];

              if (
                !service &&
                index === selectedServicesIds.length - 1 &&
                allServices.length > 0
              ) {
                console.error(
                  `Service with ID ${selectedServiceId} not found.`
                );
                return null;
              } else if (!service) {
                return null;
              }
              return (
                <tr key={index}>
                  <td>{service.title}</td>
                  <td>${servicePrice}</td>
                  <td>
                    {serviceDuration} {serviceDuration === 1 ? "hr" : "hrs"}
                  </td>
                  <td
                    onClick={() => {
                      removeSelectedService(index);
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          type="button"
          onClick={() => navigate(`${navUrls.scheduleEvent}/service-selection`)}
        >
          Add Service
        </button>
      </div>
    </>
  );
};
