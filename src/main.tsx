import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./css/defaults.css";
import "./css/styles.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Providers/AuthProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { EventsProvider } from "./Providers/EventsProvider.tsx";
import { ServicesProvider } from "./Providers/ServicesProvider.tsx";
import { PopUpModalProvider } from "./Providers/PopUpModalProvider.tsx";
import { NavProvider } from "./Providers/NavProvider.tsx";
import { ChatRoomProvider } from "./Providers/ChatRoomProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavProvider>
        <PopUpModalProvider>
          <AuthProvider>
            <ServicesProvider>
              <EventsProvider>
                <ChatRoomProvider>
                  <Toaster />
                  <App />
                </ChatRoomProvider>
              </EventsProvider>
            </ServicesProvider>
          </AuthProvider>
        </PopUpModalProvider>
      </NavProvider>
    </BrowserRouter>
  </React.StrictMode>
);
