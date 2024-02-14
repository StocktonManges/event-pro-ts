import { useState } from "react";
import { UseServices } from "../../../Providers/ServicesProvider";
import { ServiceCardsDisplay } from "./ServiceCardsDisplay";
import { UseNav } from "../../../Providers/NavProvider";

export const ProviderServicesTab = () => {
  const { filteredServicesByActiveStatus, resetCreateOrEditServiceForm } =
    UseServices();
  const { navigate, navUrls } = UseNav();
  const [viewingActiveServices, setViewingActiveServices] =
    useState<boolean>(true);

  const { activeServices, inactiveServices } = filteredServicesByActiveStatus;

  return (
    <section className="provider-services-tab flex-container">
      <button
        type="button"
        onClick={() => {
          navigate(navUrls.manageService);
          resetCreateOrEditServiceForm();
        }}
      >
        Create Service
      </button>

      <div className="service-status-tabs">
        <div
          style={
            viewingActiveServices
              ? { backgroundColor: "var(--light-green)" }
              : {}
          }
          onClick={() => {
            setViewingActiveServices(true);
          }}
        >
          <span>Active Services</span>
        </div>
        <div
          style={
            !viewingActiveServices ? { backgroundColor: "var(--coral)" } : {}
          }
          onClick={() => {
            setViewingActiveServices(false);
          }}
        >
          <span>Inactive Services</span>
        </div>
      </div>
      {viewingActiveServices ? (
        <ServiceCardsDisplay
          servicesArray={activeServices}
          showFilterOptions={true}
        />
      ) : (
        <ServiceCardsDisplay
          servicesArray={inactiveServices}
          showFilterOptions={true}
        />
      )}
    </section>
  );
};
