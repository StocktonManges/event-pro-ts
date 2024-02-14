import { Global } from "../utils/GlobalVarsAndFuncs";
import { ChatRoom, chatRoomSchema } from "../utils/types";
import { Requests } from "./getData";

export const ChatRoomsRequests = {
  postChatRoom: (newChatRoomInfo: Omit<ChatRoom, "id">): Promise<ChatRoom> =>
    fetch(`${Global.baseURL}/chat-rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChatRoomInfo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create chat room.");
        }
        return response.json();
      })
      .then((chatRoom) => chatRoomSchema.parse(chatRoom)),

  patchChatRoom: (
    newChatRoomInfo: Omit<ChatRoom, "userIds">
  ): Promise<ChatRoom> =>
    fetch(`${Global.baseURL}/chat-rooms/${newChatRoomInfo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChatRoomInfo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update chat room.");
        }
        return response.json();
      })
      .then((chatRoom) => chatRoomSchema.parse(chatRoom)),

  deleteChatRoom: (chatRoomId: number): Promise<void> =>
    fetch(`${Global.baseURL}/chat-rooms/${chatRoomId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete chat room.");
      }
      return response.json();
    }),

  getCurrentUserChatRooms: (userId: number) =>
    Requests.fetchChatRooms().then((allChatRooms) =>
      allChatRooms.filter((chatRoom) => chatRoom.userIds.includes(userId))
    ),
};
