import {
  clientSchema,
  eventStatusOption,
  pricingMethodOption,
  serviceProviderSchema,
  Event,
  TripleInputState,
} from "./types";

const baseFolderURL = "http://localhost:5173";

export const Global = {
  baseURL: "http://localhost:3000",
  baseFolderURL,
  openingHour: 8,
  closingHour: 19,
  businessHours: "Monday - Saturday, 8:00AM - 7:00 PM",
  emptyServiceProviderUser: serviceProviderSchema.parse({
    id: -1,
    accountType: "ServiceProvider",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    entityName: "",
    location: "",
    bio: "",
  }),
  emptyClientUser: clientSchema.parse({
    id: -1,
    accountType: "Client",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  }),
  emptyService: {
    id: -1,
    providerId: -1,
    title: "",
    description: "",
    image: `${baseFolderURL}/src/assets/images/default-service-image.png`,
    minAge: 0,
    maxAge: 0,
    minParticipants: 1,
    maxParticipants: 1,
    duration: 0,
    outdoors: false,
    pricingMethod: pricingMethodOption.parse("hour"),
    price: 0,
    active: false,
  },
  emptyEvent: {
    clientId: -1,
    selectedServicesIds: [],
    selectedServicesDurations: [],
    selectedServicesPrices: [],
    date: "mm-dd-yyyy",
    time: "hr:min--",
    location: " _ _ ",
    outdoors: false,
    numberOfGuests: 0,
    maxGuestAge: 0,
    minGuestAge: 0,
    notes: "",
    status: eventStatusOption.parse("booked"),
    id: -1,
  },
  emptyChatRoom: {
    id: -1,
    userIds: [],
    senderIds: [],
    messages: [],
  },
  createDateObjectFromEvent: (event: Event) => {
    const month = Number(event.date.slice(0, 2)) - 1;
    const day = Number(event.date.slice(3, 5));
    const year = Number(event.date.slice(6));
    const meridiem = event.time.slice(5);
    let hour = Number(event.time.slice(0, 2));
    if (meridiem === "PM") {
      hour += 12;
    }
    const minute = Number(event.time.slice(3, 5));
    return new Date(year, month, day, hour, minute);
  },

  formatTime: (timeInput: TripleInputState) =>
    timeInput[0] + ":" + timeInput[1] + timeInput[2],

  formatLocation: (
    addressInput: string,
    cityInput: string,
    stateInput: string
  ) =>
    addressInput.trim().toLowerCase() +
    "_" +
    cityInput.trim().toLowerCase() +
    "_" +
    stateInput.trim().toLowerCase(),
};
