import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AccountNameTypes, User, accountNameTypesSchema } from "../utils/types";
import { Requests } from "../api/getData";
import toast from "react-hot-toast";
import { AuthRequests } from "../api/auth";
import { Global } from "../utils/GlobalVarsAndFuncs";
import { UseNav } from "./NavProvider";

type TypeAuthProvider = {
  currentUser: User;
  setCurrentUser: (value: User) => void;
  allUsers: User[];
  login: ({
    username,
    password,
    accountType,
  }: Pick<User, "username" | "password" | "accountType">) =>
    | string
    | Promise<string | User>;
  logout: () => void;
  createNewAccount: (newClientInfo: User) => Promise<User | string>;
  newAccountType: AccountNameTypes;
  setNewAccountType: (value: AccountNameTypes) => void;
  updateAccount: (value: User) => Promise<User | string>;
  refetchAllUsers: () => Promise<User[] | string>;
  getUserFromId: (userId: number) => User;
  cancelAccount: (userId: number) => Promise<void | string>;
};

const authContext = createContext<TypeAuthProvider>({} as TypeAuthProvider);
export const UseAuth = () => useContext(authContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { navigate, navUrls } = UseNav();
  const [currentUser, setCurrentUser] = useState<User>(Global.emptyClientUser);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [newAccountType, setNewAccountType] =
    useState<AccountNameTypes>("Client");

  // After the username is verified through the 'getUserFromServer'
  // function, the password is verified.
  const login = ({
    username,
    password,
    accountType,
  }: Pick<User, "username" | "password" | "accountType">):
    | string
    | Promise<string | User> => {
    if (sessionStorage.getItem("user")) {
      return toast.error("Must logout current user.");
    } else {
      return AuthRequests.getUserFromUsername(username)
        .then((user) => {
          if (user.password !== password || accountType !== user.accountType) {
            throw new Error("Login failed.");
          }
          sessionStorage.setItem("user", JSON.stringify(user));
          setCurrentUser(user);
          toast.success("Logged in.");
          navigate(navUrls.userEvents);
          return user;
        })
        .catch((error) => toast.error(error.message));
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setCurrentUser({
      id: -1,
      accountType: "Client",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    });
    navigate(navUrls.home);
    toast.success("Logged out.");
  };

  const createNewAccount = (newAccountInfo: User): Promise<User | string> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...withoutId } = newAccountInfo;
    return AuthRequests.postNewAccount(withoutId)
      .then((newAccount) => {
        toast.success("New account created.");
        return newAccount;
      })
      .catch((error) => toast.error(error.message));
  };

  const updateAccount = (newAccountInfo: User): Promise<User | string> => {
    return AuthRequests.patchAccount(newAccountInfo)
      .then((user) => {
        toast.success("Account details updated.");
        refetchAllUsers();
        return user;
      })
      .catch((error) => toast.error(error.message));
  };

  const cancelAccount = (userId: number): Promise<void | string> =>
    AuthRequests.deleteAccount(userId)
      .then(() => {
        toast.success("Account canceled.");
      })
      .catch((error) => toast.error(error.message));

  const getUserFromId = (userId: number): User => {
    const user = allUsers.find((user) => user.id === userId);
    return user ? user : Global.emptyServiceProviderUser;
  };

  const refetchAllUsers = (): Promise<User[] | string> =>
    Requests.fetchUsers()
      .then((users) => {
        setAllUsers(users);
        return users;
      })
      .catch((error) => toast.error(error.message));

  useEffect(() => {
    refetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Set the currentUser to the user in local storage if it exists.
  useEffect(() => {
    const userLoggedIn = sessionStorage.getItem("user");
    if (userLoggedIn) {
      setCurrentUser(JSON.parse(userLoggedIn));
    }
    const potentialNewAccountType = sessionStorage.getItem("newAccountType");
    setNewAccountType(
      potentialNewAccountType
        ? accountNameTypesSchema.parse(potentialNewAccountType)
        : "Client"
    );
  }, []);

  return (
    <authContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers,
        login,
        logout,
        createNewAccount,
        newAccountType,
        setNewAccountType,
        updateAccount,
        refetchAllUsers,
        getUserFromId,
        cancelAccount,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
