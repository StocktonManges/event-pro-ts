import { ReactNode, createContext, useContext } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

type NavUrls = {
  home: string;
  login: string;
  selectAccountType: string;
  createAccount: string;
  userHome: string;
  userEvents: string;
  userChats: string;
  userServices: string;
  scheduleEvent: string;
  manageService: string;
};

type TypeNavProvider = {
  navigate: NavigateFunction;
  navUrls: NavUrls;
};

const NavContext = createContext<TypeNavProvider>({} as TypeNavProvider);
export const UseNav = () => useContext(NavContext);

export const NavProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const navUrls = {
    home: "/",
    login: "/login",
    selectAccountType: "/select",
    createAccount: "/create",
    userHome: "/user",
    userEvents: "/user/events",
    userChats: "/user/chats",
    userServices: "/user/services",
    scheduleEvent: "/user/events/scheduling",
    manageService: "/user/services/manage",
  };

  return (
    <NavContext.Provider
      value={{
        navigate,
        navUrls,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};
