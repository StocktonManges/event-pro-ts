import { useState } from "react";
import { User } from "../../../utils/types";
import { UseAuth } from "../../../Providers/AuthProvider";

export const UserSelection = ({
  usersArray,
  selectedUserIds,
  setSelectedUserIds,
  viewingClients,
  setViewingClients,
}: {
  usersArray: User[];
  selectedUserIds: number[];
  setSelectedUserIds: (value: number[]) => void;
  viewingClients: boolean;
  setViewingClients: (value: boolean) => void;
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const { currentUser } = UseAuth();
  const isClient = currentUser.accountType === "Client";

  const alphabetize = (userA: User, userB: User) => {
    const nameA =
      userA.accountType === "Client" ? userA.username : userA.entityName;
    const nameB =
      userB.accountType === "Client" ? userB.username : userB.entityName;
    return Intl.Collator().compare(nameA, nameB);
  };

  const filteredUsers = usersArray.filter((user) =>
    user.accountType === "Client"
      ? (user.firstName + " " + user.lastName)
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        user.username.toLowerCase().includes(searchInput.toLowerCase())
      : user.entityName.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="user-selection">
      <div className="user-selection-filter">
        <label htmlFor="search-user">Search User: </label>
        <input
          type="text"
          id="search-user"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>
      {isClient ? null : (
        <div className="user-selection-tabs-wrapper">
          <div
            onClick={() => {
              setViewingClients(true);
            }}
            style={
              viewingClients ? { backgroundColor: "var(--dark-green)" } : {}
            }
          >
            <span>Clients</span>
          </div>
          <div
            onClick={() => {
              setViewingClients(false);
            }}
            style={
              viewingClients ? {} : { backgroundColor: "var(--dark-green)" }
            }
          >
            <span>Service Providers</span>
          </div>
        </div>
      )}
      <ul>
        {filteredUsers.sort(alphabetize).map((user) => {
          const userSelected = selectedUserIds.includes(user.id);

          return (
            <li
              key={user.id}
              style={{
                backgroundColor: `${userSelected ? "var(--blue)" : "inherit"}`,
                justifyContent: `${
                  viewingClients ? "space-between" : "center"
                }`,
              }}
              onClick={() => {
                if (userSelected) {
                  return setSelectedUserIds(
                    selectedUserIds.filter((userId) => userId !== user.id)
                  );
                }
                setSelectedUserIds([...selectedUserIds, user.id]);
              }}
            >
              {user.accountType === "Client" ? (
                <>
                  <span>{user.firstName + " " + user.lastName}:</span>
                  <span className="client-username">{user.username}</span>
                </>
              ) : (
                <span id="user-selection-entity-name">{user.entityName}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
