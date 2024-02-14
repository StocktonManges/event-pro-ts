import { Navigate } from "react-router-dom";
import { UseAuth } from "../Providers/AuthProvider";
import { ServiceCardsDisplay } from "./UserFeatures/Services/ServiceCardsDisplay";
import { UseServices } from "../Providers/ServicesProvider";
import { UseNav } from "../Providers/NavProvider";
import { Global } from "../utils/GlobalVarsAndFuncs";

export const HomePage = () => {
  const { navUrls } = UseNav();
  const { currentUser } = UseAuth();
  const { allServices } = UseServices();

  const userIsLoggedIn = currentUser.id > -1;

  const allActiveServices = allServices.filter(({ active }) => active);

  return (
    <>
      {userIsLoggedIn ? (
        <Navigate to={navUrls.userEvents} />
      ) : (
        <>
          <section className="home-title">
            <div className="flex-container">
              <div className="home-image" />
              <div className="title-container">
                <div className="image-wrapper">
                  <img
                    src={
                      Global.baseFolderURL +
                      "/src/assets/images/eventpro-logo-big.png"
                    }
                    alt="eventpro logo big"
                  />
                </div>
                <h2>The one stop shop for all your party needs!</h2>
                <p>
                  Name the party service you're looking for and chances are we
                  offer it! We work with a large assortment of entertainment
                  companies in order to provide the most variety all in one
                  place. And the best part? You only have to deal with us! Just
                  create an account or log in and get your party started with
                  ease!
                </p>
              </div>
            </div>
          </section>
          <section className="home-services">
            <h2>Check out our services!</h2>
            <ServiceCardsDisplay
              servicesArray={allActiveServices}
              showFilterOptions={true}
            />
          </section>
        </>
      )}
    </>
  );
};
