import { TripleInputState, User } from "./types";

const specialChars = "!@#$%^&*()";

export const UserErrorMessages = {
  entityNameMessage: "Required field.",
  bioMessage: "Must have 2 or more words.",
  locationMessage: "Required field.",
  nameMessage: "Must only contain letters.",
  emailMessage: "Invalid email.",
  usernameMessage:
    "Must only contain letters, numbers, hyphens and underscores.",
  passwordMessage: `Must satisfy each of the following: - 8 or more characters - one or more uppercase letters - one or more lowercase letters - one or more numbers - one or more of these special characters: ${specialChars}.`,
  verifyPasswordMessage: "Passwords don't match.",
  phoneMessage: "Must be 10 digits.",
};

export const UserVerify = {
  isEntityNameValid: (entityNameInput: string) => {
    return entityNameInput !== "";
  },

  isEntityNameAvailable: (
    entityNameInput: string,
    allUsers: User[],
    currentEntityName: string | undefined = undefined
  ) => {
    if (currentEntityName === entityNameInput) {
      return true;
    } else {
      for (const user of allUsers) {
        if (user.accountType === "ServiceProvider") {
          if (user.entityName === entityNameInput) {
            return false;
          }
        }
      }
    }
    return true;
  },

  isBioValid: (bioInput: string) => {
    const regex = /^(?:\S+\s+){1,}\S+$/;
    return !!bioInput.match(regex);
  },

  isLocationValid: (locationInput: string) => {
    return locationInput !== "";
  },

  isLocationAvailable: (
    locationInput: string,
    allUsers: User[],
    currentLocation: string | undefined = undefined
  ) => {
    if (currentLocation === locationInput) {
      return true;
    }
    for (const user of allUsers) {
      if (user.accountType === "ServiceProvider") {
        if (user.location === locationInput) {
          return false;
        }
      }
    }
    return true;
  },

  isNameValid: (nameInput: string) => {
    const regex = /^[A-Za-z]+$/;
    return !!nameInput.match(regex) && nameInput !== "";
  },

  isEmailValid: (emailInput: string) => {
    // eslint-disable-next-line no-useless-escape
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return !!emailInput.match(regex) && emailInput !== "";
  },

  isEmailAvailable: (
    emailInput: string,
    allUsers: User[],
    currentEmail: string | undefined = undefined
  ) => {
    if (currentEmail === emailInput) {
      return true;
    } else {
      for (const user of allUsers) {
        if (user.email === emailInput) {
          return false;
        }
      }
    }
    return true;
  },

  isUsernameValid: (usernameInput: string) => {
    const regex = /^[a-zA-Z0-9_-]*$/;
    return !!usernameInput.match(regex) && usernameInput !== "";
  },

  isUsernameAvailable: (
    usernameInput: string,
    allUsers: User[],
    currentUsername: string | undefined = undefined
  ) => {
    if (currentUsername === usernameInput) {
      return true;
    } else {
      for (const user of allUsers) {
        if (user.username === usernameInput) {
          return false;
        }
      }
    }
    return true;
  },

  isPasswordValid: (passwordInput: string) => {
    const regex = new RegExp(
      `^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[${specialChars}]).{8,}$`
    );
    return !!passwordInput.match(regex) && passwordInput !== "";
  },

  isEditedPasswordValid: (passwordInput: string) => {
    if (passwordInput === "") {
      return true;
    }
    const regex = new RegExp(
      `^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[${specialChars}]).{8,}$`
    );
    return !!passwordInput.match(regex);
  },

  isPhoneValid: (phoneInput: TripleInputState) => {
    const digitString = phoneInput.join("");
    return digitString.length === 10;
  },
};
