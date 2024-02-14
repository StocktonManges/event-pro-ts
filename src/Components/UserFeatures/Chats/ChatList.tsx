import { UseChatRoom } from "../../../Providers/ChatRoomProvider";
import { UseAuth } from "../../../Providers/AuthProvider";
import { useState } from "react";
import { StartChatModal } from "./StartChatModal";

export const ChatList = () => {
  const { currentUserChatRooms, setSelectedChatRoomId, selectedChatRoomId } =
    UseChatRoom();
  const { currentUser, getUserFromId } = UseAuth();
  const [isDisplayed, setIsDisplayed] = useState<boolean>(false);

  return (
    <section className="chat-list">
      <button
        className="start-chat-btn"
        type="button"
        onClick={() => {
          setIsDisplayed(true);
        }}
      >
        Start Chat
      </button>
      <ul>
        {currentUserChatRooms.map((chatRoom) => {
          const chatMembers = chatRoom.userIds
            .filter((userId) => userId !== currentUser.id)
            .map((userId) => {
              const user = getUserFromId(userId);
              return user.accountType === "Client"
                ? user.username
                : user.entityName;
            })
            .join(", ");

          return (
            <li
              key={chatRoom.id}
              style={{
                backgroundColor: `${
                  selectedChatRoomId === chatRoom.id ? "var(--blue)" : "unset"
                }`,
              }}
              onClick={() => {
                setSelectedChatRoomId(chatRoom.id);
              }}
            >
              {chatMembers}
            </li>
          );
        })}
      </ul>
      <StartChatModal
        setIsDisplayed={setIsDisplayed}
        isDisplayed={isDisplayed}
      />
    </section>
  );
};
