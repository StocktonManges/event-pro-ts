import { useState } from "react";
import { UseAuth } from "../../Providers/AuthProvider";
import { AccountNameTypes, accountNameTypesSchema } from "../../utils/types";
import { Navigate } from "react-router-dom";
import { UseNav } from "../../Providers/NavProvider";

export const LoginForm = () => {
  const { login, currentUser } = UseAuth();
  const { navigate, navUrls } = UseNav();
  const userIsLoggedIn = currentUser.id > -1;

  const [passwordInput, setPasswordInput] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [loginAccountType, setLoginAccountType] =
    useState<AccountNameTypes>("Client");

  return userIsLoggedIn ? (
    <Navigate to={navUrls.userEvents} />
  ) : (
    <section className="login-form">
      <form
        className="login"
        onSubmit={(e) => {
          e.preventDefault();
          login({
            username: usernameInput,
            password: passwordInput,
            accountType: loginAccountType,
          });
          setUsernameInput("");
          setPasswordInput("");
        }}
      >
        <h2>Login</h2>
        <select
          name="user-options"
          id="user-options"
          defaultValue={"Client"}
          onChange={(e) => {
            setLoginAccountType(accountNameTypesSchema.parse(e.target.value));
          }}
        >
          <option value="Client">Client</option>
          <option value="ServiceProvider">Service Provider</option>
        </select>
        <input
          type="text"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="username-input"
          placeholder="Username..."
        />
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="password-input"
          placeholder="Password..."
        />
        <div>
          <button type="submit">Login</button>
          <span
            onClick={() => {
              navigate(navUrls.selectAccountType);
            }}
          >
            Create Account
          </span>
        </div>
      </form>
    </section>
  );
};
