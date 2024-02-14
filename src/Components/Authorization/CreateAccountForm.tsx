import { useState } from "react";
import toast from "react-hot-toast";
import { TripleInputState, User } from "../../utils/types";
import { UserVerify, UserErrorMessages } from "../../utils/UserValidations";
import { PhoneInputs } from "./PhoneInputs";
import { ErrorMessage } from "../ErrorMessage";
import { UseAuth } from "../../Providers/AuthProvider";
import { UseNav } from "../../Providers/NavProvider";

export const CreateAccountForm = () => {
  const [entityNameInput, setEntityNameInput] = useState<string>("");
  const [bioInput, setBioInput] = useState<string>("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [firstNameInput, setFirstNameInput] = useState<string>("");
  const [lastNameInput, setLastNameInput] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [phoneInput, setPhoneInput] = useState<TripleInputState>(["", "", ""]);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [verifyPasswordInput, setVerifyPasswordInput] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { allUsers, createNewAccount, newAccountType } = UseAuth();
  const { navigate, navUrls } = UseNav();

  const resetForm = () => {
    setFirstNameInput("");
    setLastNameInput("");
    setEmailInput("");
    setPhoneInput(["", "", ""]);
    setUsernameInput("");
    setPasswordInput("");
    setVerifyPasswordInput("");
  };

  const newAccountInfo: User =
    newAccountType === "Client"
      ? {
          id: -1,
          accountType: newAccountType,
          firstName: firstNameInput,
          lastName: lastNameInput,
          email: emailInput,
          phone: phoneInput.join("-"),
          username: usernameInput,
          password: passwordInput,
        }
      : {
          id: -1,
          accountType: newAccountType,
          entityName: entityNameInput,
          bio: bioInput,
          location: locationInput,
          firstName: firstNameInput,
          lastName: lastNameInput,
          email: emailInput,
          phone: phoneInput.join("-"),
          username: usernameInput,
          password: passwordInput,
        };

  const handleValidSubmit = () => {
    createNewAccount(newAccountInfo);
    setIsSubmitted(false);
    resetForm();
    navigate(navUrls.login);
  };

  const handleInvalidSubmit = () => {
    if (!UserVerify.isUsernameAvailable(usernameInput, allUsers)) {
      toast.error("Username unavailable.");
    }
    if (!UserVerify.isEntityNameAvailable(entityNameInput, allUsers)) {
      toast.error("Entity name unavailable.");
    }
    if (!UserVerify.isLocationAvailable(locationInput, allUsers)) {
      toast.error("Location unavailable.");
    }
    if (!UserVerify.isEmailAvailable(emailInput, allUsers)) {
      toast.error("Email unavailable.");
    }
    setIsSubmitted(true);
  };

  const validationsPassed =
    UserVerify.isUsernameAvailable(usernameInput, allUsers) &&
    UserVerify.isEmailAvailable(emailInput, allUsers) &&
    UserVerify.isEmailValid(emailInput) &&
    UserVerify.isNameValid(firstNameInput) &&
    UserVerify.isNameValid(lastNameInput) &&
    UserVerify.isUsernameValid(usernameInput) &&
    UserVerify.isPasswordValid(passwordInput) &&
    passwordInput === verifyPasswordInput &&
    (newAccountType === "Client"
      ? true
      : UserVerify.isEntityNameValid(entityNameInput) &&
        UserVerify.isEntityNameAvailable(entityNameInput, allUsers) &&
        UserVerify.isBioValid(bioInput) &&
        UserVerify.isLocationValid(locationInput));

  return (
    <section className="create-account-form">
      <div>
        <h2>
          New {newAccountType === "Client" ? "Client" : "Service Provider"}{" "}
          Account
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            validationsPassed ? handleValidSubmit() : handleInvalidSubmit();
          }}
        >
          {newAccountType === "ServiceProvider" && (
            <>
              <div className="input-wrapper">
                <label htmlFor="entity-name">Entity Name: </label>
                <input
                  type="text"
                  id="entity-name"
                  name="entity-name"
                  value={entityNameInput}
                  onChange={(e) => {
                    setEntityNameInput(e.target.value);
                  }}
                />
              </div>
              <ErrorMessage
                message={UserErrorMessages.entityNameMessage}
                isDisplayed={
                  isSubmitted && !UserVerify.isEntityNameValid(entityNameInput)
                }
              />

              <div className="input-wrapper textarea-wrapper">
                <label htmlFor="bio">Bio: </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={bioInput}
                  onChange={(e) => {
                    setBioInput(e.target.value);
                  }}
                />
              </div>
              <ErrorMessage
                message={UserErrorMessages.bioMessage}
                isDisplayed={isSubmitted && !UserVerify.isBioValid(bioInput)}
              />

              <div className="input-wrapper">
                <label htmlFor="location">Address: </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                  }}
                />
              </div>
              <ErrorMessage
                message={UserErrorMessages.locationMessage}
                isDisplayed={
                  isSubmitted && !UserVerify.isLocationValid(locationInput)
                }
              />
            </>
          )}

          <div className="input-wrapper">
            <label htmlFor="first-name">First Name: </label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              value={firstNameInput}
              onChange={(e) => {
                setFirstNameInput(e.target.value);
              }}
            />
          </div>
          <ErrorMessage
            message={UserErrorMessages.nameMessage}
            isDisplayed={isSubmitted && !UserVerify.isNameValid(firstNameInput)}
          />

          <div className="input-wrapper">
            <label htmlFor="last-name">Last Name: </label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              value={lastNameInput}
              onChange={(e) => {
                setLastNameInput(e.target.value);
              }}
            />
          </div>
          <ErrorMessage
            message={UserErrorMessages.nameMessage}
            isDisplayed={isSubmitted && !UserVerify.isNameValid(lastNameInput)}
          />

          <div className="input-wrapper">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
              }}
            />
          </div>
          <ErrorMessage
            message={UserErrorMessages.emailMessage}
            isDisplayed={isSubmitted && !UserVerify.isEmailValid(emailInput)}
          />

          <div className="input-wrapper">
            <PhoneInputs
              setPhoneInput={setPhoneInput}
              phoneInput={phoneInput}
            />
          </div>
          <ErrorMessage
            message={UserErrorMessages.phoneMessage}
            isDisplayed={isSubmitted && !UserVerify.isPhoneValid(phoneInput)}
          />

          <div className="input-wrapper">
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              id="username"
              name="username"
              value={usernameInput}
              onChange={(e) => {
                setUsernameInput(e.target.value);
              }}
            />
          </div>
          <ErrorMessage
            message={UserErrorMessages.usernameMessage}
            isDisplayed={
              isSubmitted && !UserVerify.isUsernameValid(usernameInput)
            }
          />

          <div className="input-wrapper">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
              }}
            />
          </div>
          <ErrorMessage
            message={UserErrorMessages.passwordMessage}
            isDisplayed={
              isSubmitted && !UserVerify.isPasswordValid(passwordInput)
            }
          />

          <div className="input-wrapper">
            <label htmlFor="verify-password">Verify Password: </label>
            <input
              type="password"
              id="verify-password"
              name="verify-password"
              value={verifyPasswordInput}
              onChange={(e) => {
                setVerifyPasswordInput(e.target.value);
              }}
            />
          </div>
          <ErrorMessage
            message={UserErrorMessages.verifyPasswordMessage}
            isDisplayed={isSubmitted && verifyPasswordInput !== passwordInput}
          />

          <div className="button-wrapper">
            <button
              type="button"
              className="btn-coral"
              onClick={() => {
                navigate(navUrls.home);
              }}
            >
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </section>
  );
};
