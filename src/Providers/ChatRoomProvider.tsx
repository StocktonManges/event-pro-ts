/* eslint-disable react-hooks/exhaustive-deps */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";
import { UseAuth } from "./AuthProvider";
import { ChatRoom, MessageData } from "../utils/types";
import { ChatRoomsRequests } from "../api/chatRooms";
import { Global } from "../utils/GlobalVarsAndFuncs";
import toast from "react-hot-toast";
import { Requests } from "../api/getData";

const socket = io("http://localhost:3001");

type TypeChatRoomProvider = {
  messageInput: string;
  setMessageInput: (value: string) => void;
  sendMessageToServer: () => void;
  currentUserChatRooms: ChatRoom[];
  currentChatRoomData: ChatRoom;
  setCurrentChatRoomData: (value: ChatRoom) => void;
  setSelectedChatRoomId: (value: number) => void;
  selectedChatRoomId: number;
  startChatRoom: (newChatRoomInfo: Omit<ChatRoom, "id">) => Promise<ChatRoom>;
};

const ChatRoomContext = createContext<TypeChatRoomProvider>(
  {} as TypeChatRoomProvider
);
export const UseChatRoom = () => useContext(ChatRoomContext);

export const ChatRoomProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = UseAuth();

  const [selectedChatRoomId, setSelectedChatRoomId] = useState<number>(-1);
  const [currentUserChatRooms, setCurrentUserChatRooms] = useState<ChatRoom[]>(
    []
  );
  const [messageInput, setMessageInput] = useState<string>("");
  const [currentChatRoomData, setCurrentChatRoomData] = useState<ChatRoom>(
    Global.emptyChatRoom
  );

  const fetchCurrentUserChatRooms = (): Promise<ChatRoom[]> =>
    ChatRoomsRequests.getCurrentUserChatRooms(currentUser.id).then(
      (userChatRooms) => {
        setCurrentUserChatRooms(userChatRooms);
        return userChatRooms;
      }
    );

  const refetchChatRoomData = (
    chatRoomId: number
  ): Promise<ChatRoom | string> =>
    Requests.fetchSingleChatRoom(chatRoomId)
      .then((chatRoom) => {
        setCurrentChatRoomData(chatRoom);
        return chatRoom;
      })
      .catch((error) => toast.error(error.message));

  const startChatRoom = (
    newChatRoomInfo: Omit<ChatRoom, "id">
  ): Promise<ChatRoom> =>
    ChatRoomsRequests.postChatRoom(newChatRoomInfo).then((chatRoom) => {
      toast.success("Started new chat room.");
      fetchCurrentUserChatRooms();
      setCurrentChatRoomData(chatRoom);
      return chatRoom;
    });

  const updateChatRoom = (newMessageData: MessageData): Promise<ChatRoom> => {
    const { room, senderId, message } = newMessageData;
    const updatedMessages = [...currentChatRoomData.messages, message];
    const updatedSenders = [...currentChatRoomData.senderIds, senderId];

    return ChatRoomsRequests.patchChatRoom({
      id: Number(room),
      messages: updatedMessages,
      senderIds: updatedSenders,
    });
  };

  const sendMessageToServer = () => {
    const newMessageData = {
      senderId: currentUser.id,
      room: selectedChatRoomId.toString(),
      message: messageInput,
    };

    updateChatRoom(newMessageData)
      .then(() => {
        refetchChatRoomData(Number(newMessageData.room));
        socket.emit("send-message", newMessageData);
      })
      .catch((error) => toast.error(error.message));
  };

  socket.on("receive-message", (newMessageData: MessageData) => {
    refetchChatRoomData(Number(newMessageData.room));
  });

  useEffect(() => {
    if (selectedChatRoomId > -1) {
      refetchChatRoomData(selectedChatRoomId);
      const room = selectedChatRoomId.toString();
      socket.emit("new-user", room);
      sessionStorage.setItem(
        "selectedChatRoomId",
        selectedChatRoomId.toString()
      );
    }
  }, [selectedChatRoomId]);

  useEffect(() => {
    if (currentUser.id > -1) {
      fetchCurrentUserChatRooms();
    } else {
      setSelectedChatRoomId(-1);
    }
  }, [currentUser]);

  useEffect(() => {
    const chatRoomSelected = sessionStorage.getItem("selectedChatRoomId");
    setSelectedChatRoomId(chatRoomSelected ? Number(chatRoomSelected) : -1);
  }, []);

  return (
    <ChatRoomContext.Provider
      value={{
        messageInput,
        setMessageInput,
        sendMessageToServer,
        currentUserChatRooms,
        currentChatRoomData,
        setCurrentChatRoomData,
        setSelectedChatRoomId,
        selectedChatRoomId,
        startChatRoom,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};
