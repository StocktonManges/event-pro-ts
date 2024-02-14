import { z } from "zod";

const client = z.literal("Client");
const serviceProvider = z.literal("ServiceProvider");
const booked = z.literal("booked");
const paid = z.literal("paid");
const completed = z.literal("completed");
const participant = z.literal("participant");
const hour = z.literal("hour");
const event = z.literal("event");
const title = z.literal("title");
const minAge = z.literal("minAge");
const maxAge = z.literal("maxAge");
const minParticipants = z.literal("minParticipants");
const maxParticipants = z.literal("maxParticipants");
const duration = z.literal("duration");
const outdoors = z.literal("outdoors");
const price = z.literal("price");
const providerId = z.literal("providerId");

export const searchByOptionSchema = z.union([title, providerId]);
export type SearchByOption = z.infer<typeof searchByOptionSchema>;
export const sortByOptionSchema = z.union([
  title,
  minAge,
  maxAge,
  minParticipants,
  maxParticipants,
  duration,
  outdoors,
  price,
]);
export type SortByOption = z.infer<typeof sortByOptionSchema>;
export const tripleInputStateSchema = z.tuple([
  z.string(),
  z.string(),
  z.string(),
]);
export type TripleInputState = z.infer<typeof tripleInputStateSchema>;
export const accountNameTypesSchema = z.union([client, serviceProvider]);
export type AccountNameTypes = z.infer<typeof accountNameTypesSchema>;

export const eventStatusOption = z.union([booked, paid, completed]);
export type EventStatusOption = z.infer<typeof eventStatusOption>;
export const pricingMethodOption = z.union([participant, hour, event]);
export type PricingMethodOption = z.infer<typeof pricingMethodOption>;

export type MessageData = {
  senderId: number;
  room: string;
  message: string;
};

export const serviceProviderSchema = z.object({
  id: z.number(),
  accountType: serviceProvider,
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  email: z.string(),
  entityName: z.string(),
  location: z.string(),
  bio: z.string(),
});

export const clientSchema = z.object({
  id: z.number(),
  accountType: client,
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  email: z.string(),
});

export const userSchemas = z.union([clientSchema, serviceProviderSchema]);
export type ClientUser = z.infer<typeof clientSchema>;
export type ServiceProviderUser = z.infer<typeof serviceProviderSchema>;
export type User = ClientUser | ServiceProviderUser;

export const eventSchema = z.object({
  id: z.number(),
  clientId: z.number(),
  selectedServicesIds: z.array(z.number()),
  selectedServicesDurations: z.array(z.number()),
  selectedServicesPrices: z.array(z.number()),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  outdoors: z.boolean(),
  numberOfGuests: z.number(),
  maxGuestAge: z.number(),
  minGuestAge: z.number(),
  notes: z.string(),
  status: eventStatusOption,
});

export type Event = z.infer<typeof eventSchema>;

export const serviceSchema = z.object({
  id: z.number(),
  providerId: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.union([z.string(), z.undefined()]),
  minAge: z.number(),
  maxAge: z.number(),
  minParticipants: z.number(),
  maxParticipants: z.number(),
  duration: z.number(),
  outdoors: z.boolean(),
  pricingMethod: pricingMethodOption,
  price: z.number(),
  active: z.boolean(),
});

export type Service = z.infer<typeof serviceSchema>;

export const chatRoomSchema = z.object({
  id: z.number(),
  userIds: z.array(z.number()),
  senderIds: z.array(z.number()),
  messages: z.array(z.string()),
});

export type ChatRoom = z.infer<typeof chatRoomSchema>;
