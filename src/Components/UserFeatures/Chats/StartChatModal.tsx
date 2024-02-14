import { useState } from "react";
import { UseAuth } from "../../../Providers/AuthProvider";
import { UseChatRoom } from "../../../Providers/ChatRoomProvider";
import { ErrorMessage } from "../../ErrorMessage";
import { UserSelection } from "./UserSelection";
import toast from "react-hot-toast";

export const StartChatModal = ({
  setIsDisplayed,
  isDisplayed,
}: {
  setIsDisplayed: (value: boolean) => void;
  isDisplayed: boolean;
}) => {
  const { allUsers, currentUser, getUserFromId } = UseAuth();
  const { startChatRoom, currentUserChatRooms, setSelectedChatRoomId } =
    UseChatRoom();
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [viewingClients, setViewingClients] = useState<boolean>(false);

  const isClient = currentUser.accountType === "Client";

  const exitModal = () => {
    setIsDisplayed(false);
    setSelectedUserIds([]);
  };

  const isDuplicateChat = (newUserIds: number[]) =>
    !currentUserChatRooms
      .filter((chatRoom) => chatRoom.userIds.length === newUserIds.length)
      .map((chatRoom) =>
        newUserIds
          .map((newUserId) => {
            return chatRoom.userIds.includes(newUserId);
          })
          .every((elm) => elm)
      )
      .every((elm) => !elm);

  const availableClients = allUsers.filter(
    (user) => user.accountType === "Client"
  );
  const availableServiceProviders = allUsers.filter(
    (user) => user.accountType === "ServiceProvider"
  );

  const selectedUserNames = selectedUserIds.map((userId) => {
    const user = getUserFromId(userId);
    return (
      <span key={userId}>
        <span>
          {user.accountType === "Client" ? user.username : user.entityName}
        </span>
        {/* <i className="fa-solid fa-trash-can"></i> */}
        <i
          className="fa-solid fa-x"
          onClick={() => {
            setSelectedUserIds(
              selectedUserIds.filter((userId) => userId !== user.id)
            );
          }}
        ></i>
      </span>
    );
  });

  return (
    <section
      className={`modal-background ${isDisplayed ? "fade-in" : "fade-out"}`}
      onClick={() => {
        exitModal();
      }}
    >
      <div
        className={`start-chat-modal ${isDisplayed ? "slide-in" : "slide-out"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modalX"
          onClick={() => {
            exitModal();
          }}
        >
          <i className="fa-solid fa-x"></i>
        </div>
        <h2>Start a chat!</h2>
        <h3>
          Select the {isClient ? "service provider(s)" : "user(s)"} you would
          like to start a chat with:
        </h3>

        <div className="selected-users-list">
          <h3>Your selection:</h3>
          <div>{selectedUserNames}</div>
        </div>

        <div className="white-overlay">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isDuplicateChat([...selectedUserIds, currentUser.id])) {
                return setIsSubmitted(true);
              }
              startChatRoom({
                userIds: [...selectedUserIds, currentUser.id],
                senderIds: [],
                messages: [],
              })
                .then((chatRoom) => {
                  exitModal();
                  setIsSubmitted(false);
                  setSelectedChatRoomId(chatRoom.id);
                })
                .catch((error) => toast.error(error.message));
            }}
          >
            {viewingClients ? (
              <UserSelection
                usersArray={availableClients}
                setSelectedUserIds={setSelectedUserIds}
                selectedUserIds={selectedUserIds}
                viewingClients={viewingClients}
                setViewingClients={setViewingClients}
              />
            ) : (
              <UserSelection
                usersArray={availableServiceProviders}
                setSelectedUserIds={setSelectedUserIds}
                selectedUserIds={selectedUserIds}
                viewingClients={viewingClients}
                setViewingClients={setViewingClients}
              />
            )}

            <button
              type="button"
              className="btn-coral"
              onClick={() => {
                exitModal();
              }}
            >
              Cancel
            </button>

            <button className="btn-dark-green" type="submit">
              Start Chat
            </button>
            <ErrorMessage
              message="A chat with the selected user(s) already exists."
              isDisplayed={
                isSubmitted &&
                isDuplicateChat([...selectedUserIds, currentUser.id])
              }
            />
          </form>
        </div>
      </div>
    </section>
  );
};
