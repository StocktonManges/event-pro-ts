import { NavLink, Outlet } from "react-router-dom";
import { UseNav } from "../../Providers/NavProvider";

export const UserNavigation = () => {
  const { navUrls } = UseNav();
  return (
    <>
      <section className="user-tabs flex-container">
        <div className="tabs-nav-link">
          <NavLink
            to={navUrls.userChats}
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: "var(--dark-green)" }
                : { backgroundColor: "inherit" }
            }
          >
            Chats
          </NavLink>
        </div>

        <div className="tabs-nav-link">
          <NavLink
            to={navUrls.userEvents}
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: "var(--dark-green)" }
                : { backgroundColor: "inherit" }
            }
          >
            My Events
          </NavLink>
        </div>

        <div className="tabs-nav-link">
          <NavLink
            to={navUrls.userServices}
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: "var(--dark-green)" }
                : { backgroundColor: "inherit" }
            }
          >
            Services
          </NavLink>
        </div>
      </section>
      <Outlet />
    </>
  );
};
