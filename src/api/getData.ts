import { z } from "zod";
import {
  ChatRoom,
  Event,
  Service,
  User,
  chatRoomSchema,
  eventSchema,
  serviceSchema,
  userSchemas,
} from "../utils/types";
import { Global } from "../utils/GlobalVarsAndFuncs";

export const Requests = {
  fetchEvents: (): Promise<Event[]> =>
    fetch(`${Global.baseURL}/events`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }
        return response.json();
      })
      .then((events) => z.array(eventSchema).parse(events)),

  fetchServices: (): Promise<Service[]> =>
    fetch(`${Global.baseURL}/services`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch services.");
        }
        return response.json();
      })
      .then((services) => z.array(serviceSchema).parse(services)),

  fetchUsers: (): Promise<User[]> =>
    fetch(`${Global.baseURL}/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }
        return response.json();
      })
      .then((users) => z.array(userSchemas).parse(users)),

  fetchChatRooms: (): Promise<ChatRoom[]> =>
    fetch(`${Global.baseURL}/chat-rooms`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch chat rooms.");
        }
        return response.json();
      })
      .then((chatRooms) => z.array(chatRoomSchema).parse(chatRooms)),

  fetchSingleChatRoom: (chatRoomId: number): Promise<ChatRoom> =>
    fetch(`${Global.baseURL}/chat-rooms/${chatRoomId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch chat room.");
        }
        return response.json();
      })
      .then((chatRoom) => chatRoomSchema.parse(chatRoom)),
};
