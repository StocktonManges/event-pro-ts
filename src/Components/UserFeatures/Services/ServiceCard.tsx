import { Service, serviceProviderSchema } from "../../../utils/types";
import { UseAuth } from "../../../Providers/AuthProvider";

export const ServiceCard = ({
  setServiceDetails,
  serviceDetails,
  service,
  setFadeIn,
}: {
  setServiceDetails: (value: Service) => void;
  serviceDetails: Service;
  service: Service;
  setFadeIn: (value: boolean) => void;
}) => {
  const { getUserFromId } = UseAuth();

  const {
    active,
    providerId,
    title,
    description,
    image,
    pricingMethod,
    price,
  } = service;

  const serviceProvider = serviceProviderSchema.parse(
    getUserFromId(providerId)
  );

  return (
    <>
      <div className="service-card">
        <div className="service-title-provider">
          <h3>{title}</h3>
          <div
            style={
              serviceProvider.entityName.length > 35
                ? { fontSize: "var(--14px)" }
                : undefined
            }
          >
            <span>by:</span>
            <div>{serviceProvider.entityName}</div>
          </div>
        </div>

        <div className="white-overlay">
          <div>
            ${price} per {pricingMethod}
          </div>
          <div className="image-container">
            <img src={image} alt="service image" />
          </div>
          <div>
            <div>{description}</div>
            <button
              disabled={serviceDetails.id > -1}
              type="button"
              onClick={() => {
                setServiceDetails(service);
                setFadeIn(true);
              }}
            >
              View
            </button>
          </div>
          {!active && (
            <span className="service-inactive">
              **Unavailable for new bookings**
            </span>
          )}
        </div>
      </div>
    </>
  );
};
