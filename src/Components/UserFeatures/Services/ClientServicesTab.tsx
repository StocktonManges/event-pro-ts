import { UseServices } from "../../../Providers/ServicesProvider";
import { ServiceCardsDisplay } from "./ServiceCardsDisplay";

export const ClientServicesTab = () => {
  const { allServices } = UseServices();

  const allActiveServices = allServices.filter(({ active }) => active);

  return (
    <section className="client-services-tab">
      <ServiceCardsDisplay
        servicesArray={allActiveServices}
        showFilterOptions={true}
      />
    </section>
  );
};
