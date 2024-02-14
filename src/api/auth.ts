import { Requests } from "./getData";
import { User, userSchemas } from "../utils/types";
import { Global } from "../utils/GlobalVarsAndFuncs";

export const AuthRequests = {
  postNewAccount: (newUserInfo: Omit<User, "id">): Promise<User> =>
    fetch(`${Global.baseURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserInfo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create new user.");
        }
        return response.json();
      })
      .then((user) => userSchemas.parse(user)),

  patchAccount: (newUserInfo: User): Promise<User> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...withoutId } = newUserInfo;
    return fetch(`${Global.baseURL}/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(withoutId),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update account details.");
        }
        return response.json();
      })
      .then((users) => userSchemas.parse(users));
  },

  deleteAccount: (userId: number): Promise<void> =>
    fetch(`${Global.baseURL}/users/${userId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }
      return response.json();
    }),

  // Returns the user from a list of users who's username matches the
  // entered username.
  getUserFromUsername: (username: string): Promise<User> =>
    Requests.fetchUsers()
      .then((users) => users.find((user) => user.username === username))
      .then((user) => {
        if (!user) {
          throw new Error("Login failed.");
        }
        return user;
      }),
};
