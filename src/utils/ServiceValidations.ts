export const ServiceErrorMessages = {
  titleMessage: "Required field.",
  descriptionMessage: "Must have 2 or more words.",
  durationMessage: 'Must be greater than 0 if fixed duration is "yes".',
  priceMessage: "Must be greater than $0.",
  maxAgeMessage:
    "Must be greater than or equal to the minimum age and cannot be negative.",
  ageMessage:
    "Minimum age must be less than or equal to the maximum age and cannot be negative.",
  participantMessage:
    "Minimum participants must be less than or equal to the maximum participants and cannot be negative.",
};

export const ServiceVerify = {
  isDescriptionValid: (descriptionInput: string) => {
    const regex = /^\s*\S+(\s+\S+)+\s*$/;
    return !!descriptionInput.match(regex);
  },
};
