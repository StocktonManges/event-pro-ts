import { UseAuth } from "../../Providers/AuthProvider";
import { useRef, useState } from "react";
import { AccountDetailsModal } from "../Authorization/AccountDetailsModal";
import { Outlet } from "react-router-dom";
import { UseNav } from "../../Providers/NavProvider";
import { Global } from "../../utils/GlobalVarsAndFuncs";

export const UserHeader = () => {
  const { currentUser, logout } = UseAuth();
  const { navigate, navUrls } = UseNav();
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [accountDetailsModalActive, setAccountDetailsModalActive] =
    useState<boolean>(false);

  const userIconLetter =
    currentUser.accountType === "Client"
      ? currentUser.firstName[0].toUpperCase()
      : currentUser.entityName[0].toUpperCase();

  const menuRef = useRef<HTMLUListElement>(null);

  const activeMenuStyles = menuActive
    ? {
        height: `${menuRef.current?.getBoundingClientRect().height}px`,
        width: `${menuRef.current?.getBoundingClientRect().width}px`,
        boxShadow: "3px 3px 3px 1px rgba(0, 0, 0, 0.5)",
      }
    : {
        height: "0",
        width: `${menuRef.current?.getBoundingClientRect().width}px`,
      };

  return (
    <>
      <header className="user-header">
        <div className="flex-container">
          <div
            className="eventpro-logo-big"
            onClick={() => {
              navigate(navUrls.userEvents);
            }}
          >
            <img
              src={`${Global.baseFolderURL}/src/assets/images/eventpro-logo-big.png`}
              alt="eventpro logo big"
            />
          </div>

          <div className="icon-menu-container">
            <div
              className="account-menu"
              onMouseOver={() => {
                setMenuActive(true);
              }}
              onMouseLeave={() => {
                setMenuActive(false);
              }}
            >
              <div className="menu-trigger">
                <span>Menu</span>
                <i
                  className="fa-solid fa-angle-left"
                  style={menuActive ? { transform: "rotate(-90deg)" } : {}}
                ></i>
              </div>
              <div className="menu-anchor">
                <div
                  className="menu-options-container"
                  style={activeMenuStyles}
                >
                  <ul ref={menuRef} className="menu-options">
                    <li onClick={() => setAccountDetailsModalActive(true)}>
                      Account Details
                    </li>
                    <li onClick={logout}>Logout</li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="user-icon">
              <div>{userIconLetter}</div>
            </div>
            <AccountDetailsModal
              setIsDisplayed={setAccountDetailsModalActive}
              isDisplayed={accountDetailsModalActive}
            />
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};
