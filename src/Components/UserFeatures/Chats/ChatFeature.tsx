import { useEffect, useRef, useState } from "react";
import { UseAuth } from "../../../Providers/AuthProvider";
import { UseChatRoom } from "../../../Providers/ChatRoomProvider";

export const ChatFeature = () => {
  const {
    messageInput,
    setMessageInput,
    sendMessageToServer,
    currentChatRoomData,
    selectedChatRoomId,
  } = UseChatRoom();
  const { currentUser, getUserFromId } = UseAuth();
  const [usersDisplayed, setUsersDisplayed] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesWrapperRef = useRef<HTMLDivElement>(null);

  const users = currentChatRoomData.userIds
    .filter((userId) => userId !== currentUser.id)
    .map((userId) => {
      const user = getUserFromId(userId);
      return user.accountType === "Client"
        ? {
            userId: user.id,
            userName: user.username,
          }
        : { userId: user.id, userName: user.entityName };
    });

  const formattedChatRoomData = currentChatRoomData.senderIds.map(
    (senderId, index) => {
      return {
        room: currentChatRoomData.id.toString(),
        senderId,
        senderName:
          senderId === currentUser.id
            ? "You"
            : users.filter((user) => user.userId === senderId)[0].userName,
        message: currentChatRoomData.messages[index],
      };
    }
  );

  const chatRoomSelected = selectedChatRoomId > -1;

  useEffect(() => {
    if (messagesWrapperRef.current) {
      messagesWrapperRef.current.scrollTop =
        messagesWrapperRef.current.scrollHeight;
    }
  }, [currentChatRoomData]);

  return (
    <section
      className="chat-feature"
      onClick={() => {
        setUsersDisplayed(false);
      }}
    >
      <div className="chat-feature-header">
        <h3>
          {chatRoomSelected
            ? `Chat Room ${currentChatRoomData.id}`
            : "No Chat Room Selected"}
        </h3>
        <div
          onClick={(e) => {
            setUsersDisplayed(!usersDisplayed);
            e.stopPropagation();
          }}
        >
          <span>
            {users.length} {users.length === 1 ? "Chat Member" : "Chat Members"}
          </span>
          <i
            className="fa-solid fa-angle-left"
            style={usersDisplayed ? { transform: "rotate(-90deg)" } : {}}
          ></i>
          {usersDisplayed && (
            <ul
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {users.map((user) => (
                <li key={user.userId}>{user.userName}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessageToServer();
          setMessageInput("");
        }}
      >
        <div className="messages-wrapper" ref={messagesWrapperRef}>
          {formattedChatRoomData.map(
            ({ senderName, senderId, message }, index) => {
              return (
                <div
                  key={index}
                  className={`message-container ${
                    senderId === currentUser.id ? "sender" : "receiver"
                  }`}
                >
                  <span>
                    <strong>{senderName}</strong>
                  </span>
                  <div>{message}</div>
                </div>
              );
            }
          )}
        </div>
        <div className="message-creation">
          <textarea
            disabled={!chatRoomSelected}
            value={messageInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessageToServer();
                setMessageInput("");
              }
            }}
            onChange={(e) => {
              setMessageInput(e.target.value);
            }}
          />
          <button
            disabled={!chatRoomSelected || messageInput.length === 0}
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
};
