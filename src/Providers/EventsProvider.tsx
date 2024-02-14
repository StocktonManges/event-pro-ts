/* eslint-disable react-hooks/exhaustive-deps */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Event,
  EventStatusOption,
  Service,
  TripleInputState,
} from "../utils/types";
import { EventsRequests } from "../api/events";
import toast from "react-hot-toast";
import { UseAuth } from "./AuthProvider";
import { EventVerify } from "../utils/EventValidations";
import { UseServices } from "./ServicesProvider";
import { UseNav } from "./NavProvider";
import { Global } from "../utils/GlobalVarsAndFuncs";
import { Requests } from "../api/getData";

type FilteredServicesForEvent = {
  matchingServices: Service[];
  mismatchingServices: Service[];
};

type StateHandlers = [
  number[],
  React.Dispatch<React.SetStateAction<number[]>>
][];

type TypeEventsProvider = {
  currentClientEvents: Event[];
  currentProviderEvents: Event[];
  validationsPassed: boolean;
  removeSelectedService: (serviceIndex: number) => void;
  addSelectedService: (selectedService: Service, duration: number) => void;
  resetCreateOrEditEventForm: () => void;
  populateEventDetails: (event: Event) => void;
  updateEvent: (event: Event) => Promise<Event | string>;
  cancelEvent: (eventId: number) => Promise<void | string>;
  filteredServicesForEvent: FilteredServicesForEvent;
  handleValidSubmit: () => void;
  handleInvalidSubmit: () => void;
  isSubmitted: boolean;
  eventBeingEdited: Event;
  setEventBeingEdited: (value: Event) => void;
  currentEventDetails: {
    id: number;
    date: TripleInputState;
    time: TripleInputState;
    address: string;
    city: string;
    state: string;
    outdoors: boolean;
    notes: string;
    numberOfGuests: number;
    maxGuestAge: number;
    minGuestAge: number;
    selectedServicesIds: number[];
    selectedServicesDurations: number[];
    selectedServicesPrices: number[];
    status: EventStatusOption;
  };
  setCurrentEventDetails: {
    setDate: (value: TripleInputState) => void;
    setTime: (value: TripleInputState) => void;
    setAddress: (value: string) => void;
    setCity: (value: string) => void;
    setState: (value: string) => void;
    setOutdoors: (value: boolean) => void;
    setNotes: (value: string) => void;
    setNumberOfGuests: (value: number) => void;
    setMaxGuestAge: (value: number) => void;
    setMinGuestAge: (value: number) => void;
    setSelectedServicesIds: (value: number[]) => void;
    setSelectedServicesDurations: (value: number[]) => void;
    setSelectedServicesPrices: (value: number[]) => void;
    setStatus: (value: EventStatusOption) => void;
  };
};

const eventsContext = createContext<TypeEventsProvider>(
  {} as TypeEventsProvider
);
export const UseEvents = () => useContext(eventsContext);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const { navigate, navUrls } = UseNav();
  const { currentUser } = UseAuth();
  const { allServices, currentProviderServices } = UseServices();

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [currentClientEvents, setCurrentClientEvents] = useState<Event[]>([]);
  const [currentProviderEvents, setCurrentProviderEvents] = useState<Event[]>(
    []
  );
  const [id, setId] = useState<number>(-1);
  const [date, setDate] = useState<TripleInputState>(["mm", "dd", "yyyy"]);
  const [time, setTime] = useState<TripleInputState>(["hr", "min", "--"]);
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [outdoors, setOutdoors] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [numberOfGuests, setNumberOfGuests] = useState<number>(0);
  const [maxGuestAge, setMaxGuestAge] = useState<number>(0);
  const [minGuestAge, setMinGuestAge] = useState<number>(0);
  const [selectedServicesIds, setSelectedServicesIds] = useState<number[]>([]);
  const [selectedServicesDurations, setSelectedServicesDurations] = useState<
    number[]
  >([]);
  const [selectedServicesPrices, setSelectedServicesPrices] = useState<
    number[]
  >([]);
  const [status, setStatus] = useState<EventStatusOption>("booked");

  const [filteredServicesForEvent, setFilteredServicesForEvent] =
    useState<FilteredServicesForEvent>({
      matchingServices: [],
      mismatchingServices: [],
    });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [eventBeingEdited, setEventBeingEdited] = useState<Event>(
    Global.emptyEvent
  );

  const currentEventDetails = {
    id,
    date,
    time,
    address,
    city,
    state,
    outdoors,
    notes,
    numberOfGuests,
    maxGuestAge,
    minGuestAge,
    selectedServicesIds,
    selectedServicesDurations,
    selectedServicesPrices,
    status,
  };

  const setCurrentEventDetails = {
    setDate,
    setTime,
    setAddress,
    setCity,
    setState,
    setOutdoors,
    setNotes,
    setNumberOfGuests,
    setMaxGuestAge,
    setMinGuestAge,
    setSelectedServicesIds,
    setSelectedServicesDurations,
    setSelectedServicesPrices,
    setStatus,
  };

  const fetchCurrentClientEvents = (): Promise<Event[] | string> =>
    EventsRequests.getCurrentClientEvents(currentUser.id)
      .then((currentEvents) => {
        setCurrentClientEvents(currentEvents);
        return currentEvents;
      })
      .catch((error) => toast.error(error.message));

  const filterCurrentProviderEvents = (): void => {
    const filteredEvents = allEvents.filter(({ selectedServicesIds }) => {
      const currentServices = currentProviderServices.map((service) => {
        return selectedServicesIds.includes(service.id);
      });
      return currentServices.includes(true);
    });

    setCurrentProviderEvents(filteredEvents);
  };

  const refetchAllEvents = (): Promise<Event[] | string> =>
    Requests.fetchEvents()
      .then((allEvents) => {
        setAllEvents(allEvents);
        markPassedPaidEventsAsCompleted(allEvents);
        return allEvents;
      })
      .catch((error) => toast.error(error.message));

  const bookEvent = (
    newEventInfo: Omit<Event, "id">
  ): Promise<Event | string> =>
    EventsRequests.postEvent(newEventInfo)
      .then((newEvent) => {
        toast.success("New event created.");
        return newEvent;
      })
      .catch((error) => toast.error(error.message));

  const resetCreateOrEditEventForm = () => {
    setDate(["mm", "dd", "yyyy"]);
    setTime(["hr", "min", "--"]);
    setAddress("");
    setCity("");
    setState("");
    setNotes("");
    setOutdoors(false);
    setNumberOfGuests(0);
    setMaxGuestAge(0);
    setMinGuestAge(0);
    setSelectedServicesIds([]);
    setSelectedServicesDurations([]);
    setSelectedServicesPrices([]);
    setIsSubmitted(false);
    setStatus("booked");

    setEventBeingEdited(Global.emptyEvent);
    sessionStorage.setItem(
      "eventBeingEdited",
      JSON.stringify(Global.emptyEvent)
    );
  };

  const updateSelectedServicesArrays = (
    id: number,
    duration: number,
    price: number
  ) => {
    setSelectedServicesIds([...selectedServicesIds, id]);
    setSelectedServicesDurations([...selectedServicesDurations, duration]);
    setSelectedServicesPrices([...selectedServicesPrices, price]);
  };

  const addSelectedService = (service: Service, duration: number): void => {
    switch (service.pricingMethod) {
      case "event":
        updateSelectedServicesArrays(service.id, duration, service.price);
        break;
      case "hour":
        updateSelectedServicesArrays(
          service.id,
          duration,
          service.price * duration
        );
        break;
      case "participant":
        updateSelectedServicesArrays(
          service.id,
          duration,
          service.price * numberOfGuests
        );
        break;
    }
  };

  const removeSelectedService = (serviceIndex: number): void => {
    const stateHandlers: StateHandlers = [
      [selectedServicesIds, setSelectedServicesIds],
      [selectedServicesDurations, setSelectedServicesDurations],
      [selectedServicesPrices, setSelectedServicesPrices],
    ];
    stateHandlers.map((state) => {
      const newArray = [...state[0]];
      newArray.splice(serviceIndex, 1);

      state[1](newArray);
    });
  };

  const validationsPassed =
    EventVerify.isDateValid(date.join("-")) &&
    EventVerify.isTimeValid(Global.formatTime(time), date.join("-")) &&
    EventVerify.isAddressValid(address) &&
    EventVerify.isCityStateValid(city) &&
    EventVerify.isCityStateValid(state) &&
    numberOfGuests > 0 &&
    minGuestAge <= maxGuestAge &&
    selectedServicesIds.length > 0;

  const handleCreateEvent = () => {
    bookEvent({
      clientId: currentUser.id,
      date: date.join("-"),
      time: Global.formatTime(time),
      location: Global.formatLocation(address, city, state),
      outdoors,
      numberOfGuests,
      maxGuestAge,
      minGuestAge,
      selectedServicesIds,
      selectedServicesDurations,
      selectedServicesPrices,
      notes,
      status: "booked",
    }).then(() => {
      fetchCurrentClientEvents();
      resetCreateOrEditEventForm();
      navigate(navUrls.userEvents);
      setIsSubmitted(false);
    });
  };

  const handleValidSubmit = () => {
    eventBeingEdited.id === -1 ? handleCreateEvent() : handleEditEvent();
  };

  const handleInvalidSubmit = () => {
    toast.error("Invalid event details.", { id: "invalidEventDetails" });
    setIsSubmitted(true);
  };

  const filterMatchingServices = (): FilteredServicesForEvent => {
    const { outdoors, numberOfGuests, maxGuestAge, minGuestAge } =
      currentEventDetails;
    const mismatchingServices: Service[] = [];
    const matchingServices = allServices.filter((service) => {
      const serviceMatches =
        service.outdoors === outdoors &&
        ((numberOfGuests <= service.maxParticipants &&
          numberOfGuests >= service.minParticipants) ||
          service.maxParticipants === 0) &&
        (service.maxAge === 0
          ? true
          : maxGuestAge <= service.maxAge && minGuestAge >= service.minAge);
      if (!serviceMatches && service.active) {
        mismatchingServices.push(service);
      }
      return serviceMatches && service.active;
    });
    return { matchingServices, mismatchingServices };
  };

  const markPassedPaidEventsAsCompleted = (allEvents: Event[]) => {
    const currentDate = new Date().valueOf();
    allEvents.map((event) => {
      const eventDate = Global.createDateObjectFromEvent(event).valueOf();
      if (event.status === "paid" && eventDate < currentDate) {
        updateEvent({ ...event, status: "completed" });
      }
    });
  };

  /************************ EDITING EVENT CODE ************************/

  const updateEvent = (eventInfo: Event): Promise<Event | string> =>
    EventsRequests.patchEvent(eventInfo)
      .then((editedEvent) => {
        toast.success("Event updated.");
        refetchAllEvents();
        return editedEvent;
      })
      .catch((error) => toast.error(error.message));

  const cancelEvent = (eventId: number): Promise<void | string> =>
    EventsRequests.deleteEvent(eventId)
      .then(() => {
        toast.success("Event deleted.");
      })
      .catch((error) => toast.error(error.message));

  const handleEditEvent = () => {
    updateEvent({
      id,
      clientId: currentUser.id,
      date: date.join("-"),
      time: Global.formatTime(time),
      location: Global.formatLocation(address, city, state),
      outdoors,
      numberOfGuests,
      maxGuestAge,
      minGuestAge,
      selectedServicesIds,
      selectedServicesDurations,
      selectedServicesPrices,
      notes,
      status,
    }).then(() => {
      fetchCurrentClientEvents();
      resetCreateOrEditEventForm();
      navigate(navUrls.userEvents);
    });
  };

  const populateEventDetails = (event: Event) => {
    const hour = event.time.slice(0, 2);
    const minute = event.time.slice(3, 5);
    const meridiem = event.time.slice(5);
    const eventDate = event.date.split("-");
    const eventLocation = event.location.split("_");
    setId(event.id);
    setDate([eventDate[0], eventDate[1], eventDate[2]]);
    setTime([hour, minute, meridiem]);
    setAddress(eventLocation[0] === " " ? "" : eventLocation[0]);
    setCity(eventLocation[1] === " " ? "" : eventLocation[1]);
    setState(eventLocation[2] === " " ? "" : eventLocation[2]);
    setOutdoors(event.outdoors);
    setNotes(event.notes);
    setNumberOfGuests(event.numberOfGuests);
    setMaxGuestAge(event.maxGuestAge);
    setMinGuestAge(event.minGuestAge);
    setSelectedServicesIds(event.selectedServicesIds);
    setSelectedServicesDurations(event.selectedServicesDurations);
    setSelectedServicesPrices(event.selectedServicesPrices);
    setStatus(event.status);
  };

  const repopulateEventFormWithEventBeingEditedDetails = () => {
    const potentialEventDetails = sessionStorage.getItem("eventBeingEdited");
    const eventDetails: Event = potentialEventDetails
      ? JSON.parse(potentialEventDetails)
      : Global.emptyEvent;
    setEventBeingEdited(eventDetails);
    populateEventDetails(eventDetails);
  };

  useEffect(() => {
    setFilteredServicesForEvent(filterMatchingServices());
  }, [
    currentEventDetails.outdoors,
    currentEventDetails.numberOfGuests,
    currentEventDetails.maxGuestAge,
    currentEventDetails.minGuestAge,
    allServices,
  ]);

  useEffect(() => {
    fetchCurrentClientEvents();
  }, [currentUser]);

  useEffect(() => {
    filterCurrentProviderEvents();
  }, [currentProviderServices, allEvents]);

  useEffect(() => {
    refetchAllEvents();
    repopulateEventFormWithEventBeingEditedDetails();
    setFilteredServicesForEvent(filterMatchingServices());
  }, []);

  return (
    <eventsContext.Provider
      value={{
        currentClientEvents,
        currentProviderEvents,
        removeSelectedService,
        validationsPassed,
        addSelectedService,
        resetCreateOrEditEventForm,
        populateEventDetails,
        updateEvent,
        cancelEvent,
        filteredServicesForEvent,
        handleValidSubmit,
        handleInvalidSubmit,
        isSubmitted,
        eventBeingEdited,
        setEventBeingEdited,
        currentEventDetails,
        setCurrentEventDetails,
      }}
    >
      {children}
    </eventsContext.Provider>
  );
};
