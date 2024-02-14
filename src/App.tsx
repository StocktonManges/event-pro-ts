import { Route, Routes } from "react-router-dom";
import { EventProHeader } from "./Components/EventProHeader";
import { SelectAccountTypeForm } from "./Components/Authorization/SelectAccountTypeForm";
import { CreateAccountForm } from "./Components/Authorization/CreateAccountForm";
import { LoginForm } from "./Components/Authorization/LoginForm";
import { HomePage } from "./Components/HomePage";
import { UserNavigation } from "./Components/UserFeatures/UserNavigation";
import { Error404Page } from "./Components/Error404Page";
import { CreateOrEditEventForm } from "./Components/UserFeatures/Events/CreateOrEditEvent/CreateOrEditEventForm";
import { ChatsTab } from "./Components/UserFeatures/Chats/ChatsTab";
import { ClientServicesTab } from "./Components/UserFeatures/Services/ClientServicesTab";
import { EventsTab } from "./Components/UserFeatures/Events/EventsTab";
import { ProviderServicesTab } from "./Components/UserFeatures/Services/ProviderServicesTab";
import { ServiceSelection } from "./Components/UserFeatures/Events/CreateOrEditEvent/ServiceSelection";
import { UserHeader } from "./Components/UserFeatures/UserHeader";
import { UserHome } from "./Components/UserFeatures/UserHome";
import { PopUpModal } from "./Components/PopUpModal";
import { UsePopUpModal } from "./Providers/PopUpModalProvider";
import { UseAuth } from "./Providers/AuthProvider";
import { UseNav } from "./Providers/NavProvider";
import { CreateOrEditServiceForm } from "./Components/UserFeatures/Services/CreateOrEditServiceForm";

export const App = () => {
  const { navUrls } = UseNav();
  const { currentUser } = UseAuth();
  const { popUpModalVisible, popUpModalMessage, popUpModalButtonPropsArr } =
    UsePopUpModal();
  const isClient = currentUser.accountType === "Client";
  const userLoggedIn = currentUser.id > -1;

  return (
    <>
      {popUpModalVisible && (
        <PopUpModal
          message={popUpModalMessage}
          buttonPropsArr={popUpModalButtonPropsArr}
        />
      )}
      <Routes>
        <Route path={navUrls.home} element={<EventProHeader />}>
          <Route index element={<HomePage />} />
          <Route path={navUrls.login} element={<LoginForm />} />
          <Route
            path={navUrls.selectAccountType}
            element={<SelectAccountTypeForm />}
          />
          <Route path={navUrls.createAccount} element={<CreateAccountForm />} />
        </Route>

        {!userLoggedIn ? null : (
          <Route element={<UserHeader />}>
            <Route path={navUrls.userHome} element={<UserNavigation />}>
              <Route index element={<UserHome />} />
              <Route path={navUrls.userEvents} element={<EventsTab />} />
              <Route path={navUrls.userChats} element={<ChatsTab />} />
              <Route
                path={navUrls.userServices}
                element={
                  isClient ? <ClientServicesTab /> : <ProviderServicesTab />
                }
              />
            </Route>
            <Route
              path={`${navUrls.scheduleEvent}/service-selection`}
              element={<ServiceSelection />}
            />
            <Route
              path={navUrls.scheduleEvent}
              element={<CreateOrEditEventForm />}
            />
            <Route
              path={`${navUrls.manageService}`}
              element={<CreateOrEditServiceForm />}
            />
          </Route>
        )}

        <Route path="*" element={<Error404Page />} />
      </Routes>
    </>
  );
};
