import { useLocation } from "react-router-dom";
import { UseNav } from "../../Providers/NavProvider";

export const UserHome = () => {
  const { navigate, navUrls } = UseNav();
  const navLocation = useLocation();
  if (
    navLocation.pathname === navUrls.userHome ||
    navLocation.pathname === navUrls.userHome + "/"
  ) {
    navigate(navUrls.userEvents);
  }
  return (
    <section id="userHome">
      <h1>Redirecting...</h1>
    </section>
  );
};
