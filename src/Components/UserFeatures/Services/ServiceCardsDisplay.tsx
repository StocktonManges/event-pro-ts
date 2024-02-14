import { useState } from "react";
import {
  Service,
  SortByOption,
  serviceProviderSchema,
  sortByOptionSchema,
} from "../../../utils/types";
import { ServiceCard } from "./ServiceCard";
import { UseAuth } from "../../../Providers/AuthProvider";
import { ServiceDetailsModal } from "./ServiceDetailsModal";
import { Global } from "../../../utils/GlobalVarsAndFuncs";

export const ServiceCardsDisplay = ({
  servicesArray,
  showFilterOptions,
}: {
  servicesArray: Service[];
  showFilterOptions: boolean;
}) => {
  const { getUserFromId } = UseAuth();
  const [sortBy, setSortBy] = useState<SortByOption>("title");
  const [sortDirection, setSortDirection] = useState<
    "ascending" | "descending"
  >("descending");
  const [searchInput, setSearchInput] = useState<string>("");
  const [serviceDetails, setServiceDetails] = useState<Service>(
    Global.emptyService
  );
  const [fadeIn, setFadeIn] = useState<boolean>(false);

  const exitModal = () => {
    setFadeIn(false);
    // This timeout function needs to match the .slide-out animation time.
    setTimeout(() => {
      setServiceDetails(Global.emptyService);
    }, 1000);
  };

  const compareServicePropertyAndSearchInput = (a: Service, b: Service) => {
    const compareSequence =
      sortDirection === "descending"
        ? [a[sortBy], b[sortBy]]
        : [b[sortBy], a[sortBy]];
    const serviceA = compareSequence[0];
    const serviceB = compareSequence[1];

    if (typeof serviceA === "number" && typeof serviceB === "number") {
      // This is backwards so that whether it's being sorted by strings
      // or numbers the "sortDirection" button will be accurate.
      return serviceB - serviceA;
    } else if (typeof serviceA === "string" && typeof serviceB === "string") {
      return Intl.Collator().compare(serviceA, serviceB);
    } else {
      return serviceA ? -1 : 1;
    }
  };

  const verifySearchValueMatches = (service: Service) => {
    const serviceProvider = serviceProviderSchema.parse(
      getUserFromId(service.providerId)
    );

    const searchValueMatches =
      service.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      serviceProvider.entityName
        .toLowerCase()
        .includes(searchInput.toLowerCase());
    return searchValueMatches;
  };

  return (
    <section className="service-cards-display">
      {showFilterOptions && (
        <div className="service-sorting flex-container">
          <span>
            <label htmlFor="search-input">Search: </label>
            <input
              id="search-input"
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
          </span>

          <span>
            <label htmlFor="sort-by-option">Sort by: </label>
            <select
              name="sort-by-option"
              id="sort-by-option"
              value={sortBy}
              onChange={(e) => {
                setSortBy(sortByOptionSchema.parse(e.target.value));
              }}
            >
              <option value="title">Title</option>
              <option value="minAge">Min Age</option>
              <option value="maxAge">Max Age</option>
              <option value="minParticipants">Min Participants</option>
              <option value="maxParticipants">Max Participants</option>
              <option value="duration">Duration</option>
              <option value="outdoors">Outdoors</option>
              <option value="price">Price</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setSortDirection(
                  sortDirection === "ascending" ? "descending" : "ascending"
                );
              }}
            >
              {sortDirection}
            </button>
          </span>
        </div>
      )}

      <div className="service-cards-wrapper">
        {servicesArray
          .sort(compareServicePropertyAndSearchInput)
          .map((service, index) => {
            return (
              verifySearchValueMatches(service) && (
                <div
                  className={`service-card-container ${
                    showFilterOptions ? "scroll-fade-in" : ""
                  }`}
                  key={index}
                >
                  <ServiceCard
                    service={service}
                    setServiceDetails={setServiceDetails}
                    serviceDetails={serviceDetails}
                    setFadeIn={setFadeIn}
                  />
                </div>
              )
            );
          })}
        <ServiceDetailsModal
          exitModal={exitModal}
          serviceDetails={serviceDetails}
          fadeIn={fadeIn}
        />
      </div>
    </section>
  );
};
