import { Outlet } from "react-router-dom";
import { UseNav } from "../Providers/NavProvider";
import { Global } from "../utils/GlobalVarsAndFuncs";

export const EventProHeader = () => {
  const { navigate, navUrls } = UseNav();

  return (
    <>
      <header className="event-pro-header">
        <div>
          <div
            className="eventpro-logo-big"
            onClick={() => {
              navigate(navUrls.home);
            }}
          >
            <img
              src={`${Global.baseFolderURL}/src/assets/images/eventpro-logo-big.png`}
              alt="eventpro logo big"
            />
          </div>
          <div>
            <button
              onClick={() => {
                navigate(navUrls.login);
              }}
            >
              Login
            </button>

            <button
              onClick={() => {
                navigate(navUrls.selectAccountType);
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};
