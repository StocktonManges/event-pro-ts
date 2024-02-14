import { useState } from "react";
import { UseEvents } from "../../../Providers/EventsProvider";
import { Service, serviceProviderSchema } from "../../../utils/types";
import { HourSelectionModal } from "../Events/CreateOrEditEvent/HourSelectionModal";
import { UseAuth } from "../../../Providers/AuthProvider";
import { UseNav } from "../../../Providers/NavProvider";
import { UseServices } from "../../../Providers/ServicesProvider";

export const ServiceDetailsModal = ({
  fadeIn,
  serviceDetails,
  exitModal,
}: {
  fadeIn: boolean;
  serviceDetails: Service;
  exitModal: () => void;
}) => {
  const { addSelectedService, filteredServicesForEvent } = UseEvents();
  const { getUserFromId, currentUser } = UseAuth();
  const { navigate, navUrls } = UseNav();
  const { setServiceBeingEdited, populateServiceDetails } = UseServices();
  const [hourModalActive, setHourModalActive] = useState<boolean>(false);

  const {
    id,
    providerId,
    title,
    description,
    image,
    minAge,
    maxAge,
    minParticipants,
    maxParticipants,
    duration,
    outdoors,
    pricingMethod,
    price,
    active,
  } = serviceDetails;
  const provider = serviceProviderSchema.parse(getUserFromId(providerId));
  const availableIds = filteredServicesForEvent.matchingServices.map(
    ({ id }) => id
  );
  const isAvailable = availableIds.includes(id);
  const isServiceProvider = currentUser.accountType === "ServiceProvider";

  return (
    <section
      className={`modal-background ${fadeIn ? "fade-in" : "fade-out"}`}
      onClick={() => {
        exitModal();
      }}
    >
      <div
        className={`service-details-modal ${fadeIn ? "slide-in" : "slide-out"}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="modalX"
          onClick={() => {
            exitModal();
          }}
        >
          <i className="fa-solid fa-x"></i>
        </div>
        <div className="service-title-provider">
          <h2>{title}</h2>
          <div>
            <span>by:</span>
            <div>{provider.entityName}</div>
          </div>
        </div>
        <div className="white-overlay">
          <h4>
            ${price} per {pricingMethod}
          </h4>
          <div className="image-container">
            <img src={image} alt="service image" />
          </div>
          <div>{description}</div>

          <table>
            <tbody>
              <tr>
                <td>
                  {maxAge === 0
                    ? "No age limits"
                    : `Ages ${minAge} to ${maxAge}`}
                </td>
                <td>{outdoors ? "Outdoors" : "Indoors"}</td>
              </tr>
              <tr>
                <td>
                  {maxParticipants === 0
                    ? "No participant requirement"
                    : `${minParticipants} to ${maxParticipants} participants`}
                </td>
                <td>
                  {duration > 0
                    ? `${duration} ${duration === 1 ? "hour" : "hours"}`
                    : "No set duration"}
                </td>
              </tr>
            </tbody>
          </table>

          {isAvailable && (
            /* This button renders when this component is accessed via the
            booking form. */
            <>
              <button
                type="button"
                onClick={() => {
                  if (pricingMethod !== "hour") {
                    addSelectedService(serviceDetails, duration);
                    navigate(navUrls.scheduleEvent);
                    exitModal();
                    return;
                  }
                  setHourModalActive(true);
                }}
              >
                Select
              </button>
            </>
          )}

          {isServiceProvider && (
            <button
              type="button"
              onClick={() => {
                navigate(navUrls.manageService);
                populateServiceDetails({
                  ...serviceDetails,
                  image: undefined,
                });
                sessionStorage.setItem(
                  "serviceBeingEdited",
                  JSON.stringify({ ...serviceDetails, image: undefined })
                );
                setServiceBeingEdited({
                  ...serviceDetails,
                  image: undefined,
                });
              }}
            >
              Edit
            </button>
          )}
          {!active && (
            <span className="service-inactive">
              **Unavailable for new bookings**
            </span>
          )}
        </div>
      </div>

      <HourSelectionModal
        setHourModalActive={setHourModalActive}
        hourModalActive={hourModalActive}
        exitModal={exitModal}
        service={serviceDetails}
      />
    </section>
  );
};
