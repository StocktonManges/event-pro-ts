import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  TripleInputState,
  User,
  tripleInputStateSchema,
} from "../../utils/types";
import { UserVerify, UserErrorMessages } from "../../utils/UserValidations";
import { PhoneInputs } from "./PhoneInputs";
import { ErrorMessage } from "../ErrorMessage";
import { UseAuth } from "../../Providers/AuthProvider";
import { UsePopUpModal } from "../../Providers/PopUpModalProvider";
import { UseEvents } from "../../Providers/EventsProvider";
import { UseServices } from "../../Providers/ServicesProvider";

const separatePhoneNumber = (phoneNumber: string) => {
  return tripleInputStateSchema.parse(phoneNumber.split("-"));
};

export const AccountDetailsModal = ({
  isDisplayed,
  setIsDisplayed,
}: {
  isDisplayed: boolean;
  setIsDisplayed: (value: boolean) => void;
}) => {
  const { triggerPopUpModal, exitPopUpModal } = UsePopUpModal();
  const {
    allUsers,
    currentUser,
    updateAccount,
    refetchAllUsers,
    setCurrentUser,
    cancelAccount,
    logout,
  } = UseAuth();
  const { currentProviderEvents } = UseEvents();
  const { deactivateAllProviderServices } = UseServices();

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

  const resetEditAccountDetailsForm = () => {
    if (currentUser.accountType === "ServiceProvider") {
      setEntityNameInput(currentUser.entityName);
      setBioInput(currentUser.bio);
      setLocationInput(currentUser.location);
    }
    setFirstNameInput(currentUser.firstName);
    setLastNameInput(currentUser.lastName);
    setEmailInput(currentUser.email);
    setPhoneInput(separatePhoneNumber(currentUser.phone));
    setUsernameInput(currentUser.username);
    setPasswordInput("");
    setVerifyPasswordInput("");
  };

  const handleValidSubmit = () => {
    const newAccountInfo: User =
      currentUser.accountType === "Client"
        ? {
            id: currentUser.id,
            accountType: currentUser.accountType,
            firstName: firstNameInput,
            lastName: lastNameInput,
            email: emailInput,
            phone: phoneInput.join("-"),
            username: usernameInput,
            password:
              passwordInput === "" ? currentUser.password : passwordInput,
          }
        : {
            id: currentUser.id,
            accountType: currentUser.accountType,
            entityName: entityNameInput,
            bio: bioInput,
            location: locationInput,
            firstName: firstNameInput,
            lastName: lastNameInput,
            email: emailInput,
            phone: phoneInput.join("-"),
            username: usernameInput,
            password:
              passwordInput === "" ? currentUser.password : passwordInput,
          };
    updateAccount(newAccountInfo).then(() => {
      sessionStorage.setItem("user", JSON.stringify(newAccountInfo));
      setCurrentUser(newAccountInfo);
      refetchAllUsers();
      resetEditAccountDetailsForm();
      setIsDisplayed(false);
    });
  };

  const handleInvalidSubmit = () => {
    if (currentUser.accountType === "ServiceProvider") {
      if (
        !UserVerify.isEntityNameAvailable(
          entityNameInput,
          allUsers,
          currentUser.entityName
        )
      ) {
        toast.error("Entity name unavailable.");
      }
      if (
        !UserVerify.isLocationAvailable(
          locationInput,
          allUsers,
          currentUser.location
        )
      ) {
        toast.error("Location unavailable.");
      }
    }
    if (
      !UserVerify.isUsernameAvailable(
        usernameInput,
        allUsers,
        currentUser.username
      )
    ) {
      toast.error("Username unavailable.");
    }

    if (!UserVerify.isEmailAvailable(emailInput, allUsers, currentUser.email)) {
      toast.error("Email unavailable.");
    }
    if (passwordInput === currentUser.password) {
      toast.error("You must enter a new password.");
    }
    setIsSubmitted(true);
  };

  const validationsPassed =
    UserVerify.isUsernameAvailable(
      usernameInput,
      allUsers,
      currentUser.username
    ) &&
    UserVerify.isPhoneValid(phoneInput) &&
    UserVerify.isEmailAvailable(emailInput, allUsers, currentUser.email) &&
    UserVerify.isEmailValid(emailInput) &&
    UserVerify.isNameValid(firstNameInput) &&
    UserVerify.isNameValid(lastNameInput) &&
    UserVerify.isUsernameValid(usernameInput) &&
    UserVerify.isEditedPasswordValid(passwordInput) &&
    passwordInput === verifyPasswordInput &&
    passwordInput !== currentUser.password &&
    (currentUser.accountType === "Client"
      ? true
      : UserVerify.isEntityNameValid(entityNameInput) &&
        UserVerify.isEntityNameAvailable(
          entityNameInput,
          allUsers,
          currentUser.entityName
        ) &&
        UserVerify.isBioValid(bioInput) &&
        UserVerify.isLocationValid(locationInput) &&
        UserVerify.isLocationAvailable(
          locationInput,
          allUsers,
          currentUser.location
        ));

  const servicesBookedCannotCancelAccount = () => {
    triggerPopUpModal(
      "Once all of your events have been completed, you may cancel your account. Would you like to make your services unavailable to avoid further bookings?",
      [
        {
          type: "button",
          children: "Yes",
          onClick: () => {
            exitPopUpModal();
            deactivateAllProviderServices();
          },
        },
        {
          type: "button",
          children: "No",
          onClick: () => {
            exitPopUpModal();
          },
        },
      ]
    );
  };

  const cancelAccountVerification = () => {
    triggerPopUpModal("Are you sure you want to cancel your account?", [
      {
        type: "button",
        children: "Yes",
        onClick: () => {
          exitPopUpModal();
          cancelAccount(currentUser.id);
          logout();
        },
      },
      {
        type: "button",
        children: "No",
        onClick: () => {
          exitPopUpModal();
        },
      },
    ]);
  };

  useEffect(() => {
    resetEditAccountDetailsForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisplayed]);

  return (
    <section
      className={`modal-background ${isDisplayed ? "fade-in" : "fade-out"}`}
      onClick={() => {
        setIsDisplayed(false);
        resetEditAccountDetailsForm();
      }}
    >
      <div
        className={`account-details-modal ${
          isDisplayed ? "slide-in" : "slide-out"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modalX"
          onClick={() => {
            setIsDisplayed(false);
            resetEditAccountDetailsForm();
          }}
        >
          <i className="fa-solid fa-x"></i>
        </div>
        <h2>Account Details</h2>
        <div className="white-overlay">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              validationsPassed ? handleValidSubmit() : handleInvalidSubmit();
            }}
          >
            {currentUser.accountType === "ServiceProvider" && (
              <>
                <div className="input-wrapper">
                  <label htmlFor="entity-name">Entity Name:</label>
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
                    isSubmitted &&
                    !UserVerify.isEntityNameValid(entityNameInput)
                  }
                />

                <div className="input-wrapper textarea-wrapper">
                  <label htmlFor="bio">Bio:</label>
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
                  <label htmlFor="location">Address:</label>
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
              <label htmlFor="first-name">First Name:</label>
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
              isDisplayed={
                isSubmitted && !UserVerify.isNameValid(firstNameInput)
              }
            />

            <div className="input-wrapper">
              <label htmlFor="last-name">Last Name:</label>
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
              isDisplayed={
                isSubmitted && !UserVerify.isNameValid(lastNameInput)
              }
            />

            <div className="input-wrapper">
              <label htmlFor="email">Email:</label>
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
              <label htmlFor="username">Username:</label>
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
              <label htmlFor="password">New Password:</label>
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
                isSubmitted && !UserVerify.isEditedPasswordValid(passwordInput)
              }
            />

            <div className="input-wrapper">
              <label htmlFor="verify-password">Verify New Password:</label>
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
                onClick={() => {
                  setIsDisplayed(false);
                  resetEditAccountDetailsForm();
                }}
              >
                Cancel Changes
              </button>

              <button className="btn-dark-green" type="submit">
                Save Changes
              </button>

              <button
                className="btn-coral"
                type="button"
                onClick={() => {
                  const incompleteProviderEvents = currentProviderEvents.filter(
                    (event) => event.status !== "completed"
                  );

                  if (
                    currentUser.accountType === "ServiceProvider" &&
                    incompleteProviderEvents.length > 0
                  ) {
                    servicesBookedCannotCancelAccount();
                  } else {
                    cancelAccountVerification();
                  }
                }}
              >
                Cancel Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
