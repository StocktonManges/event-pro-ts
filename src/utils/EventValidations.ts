import { Global } from "./GlobalVarsAndFuncs";

const { closingHour, openingHour, businessHours } = Global;

const locationChars = "- . ' , #";

const dateIsOnSunday = (year: string, month: string, day: string) =>
  new Date(`${year}-${month}-${day}T00:00:00`).getDay() === 0;

const getCurrDate = () => {
  const dateObj = new Date();
  return {
    currMonth: dateObj.getMonth() + 1,
    currDay: dateObj.getDate(),
    currYear: dateObj.getFullYear(),
    currDate: dateObj.toLocaleDateString(),
    currHour: dateObj.getHours(),
    currMinute: dateObj.getMinutes(),
  };
};

export const EventErrorMessages = {
  dateMessage: `Must be at least 24 hours in advance, no more than one year in advance and during business hours: ${businessHours}`,
  timeMessage: `Must be at least 24 hours in advance and during business hours: ${businessHours}`,
  addressMessage: `Must contain at least one uppercase or lowercase letter and one number and can only contain these characters: ${locationChars}`,
  cityStateMessage: "Must only contain letters and single spaces.",
  numberOfGuestsMessage: "Must have one or more guests.",
  guestAgeMessage:
    "Minimum guest age must be less than or equal to the maximum guest age and cannot be negative.",
  servicesMessage: "At least one service must be selected.",
  hourSelectionMessage: "Must be greater than 0 and in increments of 0.5.",
};

export const EventVerify = {
  isDateValid: (dateInput: string) => {
    const MonthString = dateInput.slice(0, 2);
    const DayString = dateInput.slice(3, 5);
    const yearString = dateInput.slice(6);
    const monthInput = Number(dateInput.slice(0, 2));
    const dayInput = Number(dateInput.slice(3, 5));
    const yearInput = Number(dateInput.slice(6));
    // Checks if each input is a number.
    const dateSelected = [monthInput, dayInput, yearInput].every((dateElm) => {
      return !isNaN(Number(dateElm) + 1);
    });
    const { currMonth, currDay, currYear, currDate } = getCurrDate();

    if (
      // No date was selected.
      !dateSelected ||
      dateIsOnSunday(yearString, MonthString, DayString) ||
      // Date is in the past.
      dateInput === currDate ||
      (monthInput === currMonth &&
        dayInput < currDay &&
        yearInput === currYear) ||
      (monthInput < currMonth && yearInput === currYear) ||
      // Date is more than one year in the future.
      (monthInput === currMonth &&
        dayInput > currDay &&
        yearInput > currYear) ||
      (monthInput > currMonth && yearInput > currYear)
    ) {
      return false;
    }
    return true;
  },

  isTimeValid: (timeInput: string, dateInput: string) => {
    const { currMonth, currDay, currYear, currHour, currMinute } =
      getCurrDate();
    const monthInput = Number(dateInput.slice(0, 2));
    const dayInput = Number(dateInput.slice(3, 5));
    const yearInput = Number(dateInput.slice(6));
    const meridiemInput = timeInput.slice(5);
    const minuteInput = Number(timeInput.slice(3, 5));

    let hourInput = Number(timeInput.slice(0, 2));
    if (meridiemInput === "PM" && hourInput < 12) {
      hourInput += 12;
    } else if (meridiemInput === "AM" && hourInput === 12) {
      hourInput += 12;
    }
    // Checks if each input is a number.
    const timeSelected = [meridiemInput, minuteInput, hourInput].every(
      (dateElm, index) => {
        return index === 0
          ? meridiemInput !== "--"
          : !isNaN(Number(dateElm) + 1);
      }
    );

    if (
      // Time is less than 24 hours in advance.
      monthInput === currMonth &&
      dayInput === currDay + 1 &&
      yearInput === currYear
    ) {
      return (hourInput === currHour && minuteInput < currMinute) ||
        hourInput < currHour ||
        // Time is outside of business hours.
        hourInput < openingHour ||
        hourInput > closingHour ||
        (hourInput === closingHour && minuteInput > 0)
        ? false
        : true;
    } else if (
      hourInput < openingHour ||
      hourInput > closingHour ||
      (hourInput === closingHour && minuteInput > 0) ||
      // No time was selected.
      !timeSelected
    ) {
      return false;
    }
    return true;
  },

  isCityStateValid: (cityStateInput: string) => {
    return (
      !!cityStateInput.match(/[A-Za-z]/) &&
      !cityStateInput.includes("  ") &&
      cityStateInput !== ""
    );
  },

  isAddressValid: (locationInput: string) => {
    // eslint-disable-next-line no-useless-escape
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\s\-\.#]+$/;
    return (
      !!locationInput.match(regex) &&
      !locationInput.includes("  ") &&
      locationInput !== ""
    );
  },

  isServiceSelectionValid: (selectedServicesIds: number[]) => {
    return selectedServicesIds.length > 0;
  },
};
