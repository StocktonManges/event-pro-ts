import {
  EventErrorMessages,
  EventVerify,
} from "../../../../utils/EventValidations";
import { DateInputs } from "./DateInputs";
import { ErrorMessage } from "../../../ErrorMessage";
import { TimeInputs } from "./TimeInputs";
import { UseEvents } from "../../../../Providers/EventsProvider";
import { UsePopUpModal } from "../../../../Providers/PopUpModalProvider";
import { Global } from "../../../../utils/GlobalVarsAndFuncs";

export const EventDetailsInputs = () => {
  const { currentEventDetails, setCurrentEventDetails, isSubmitted } =
    UseEvents();
  const { triggerPopUpModal, exitPopUpModal } = UsePopUpModal();

  const {
    date,
    time,
    address,
    city,
    state,
    outdoors,
    numberOfGuests,
    maxGuestAge,
    minGuestAge,
    selectedServicesIds,
  } = currentEventDetails;
  const {
    setDate,
    setTime,
    setAddress,
    setCity,
    setState,
    setOutdoors,
    setNumberOfGuests,
    setMaxGuestAge,
    setMinGuestAge,
    setSelectedServicesDurations,
    setSelectedServicesIds,
    setSelectedServicesPrices,
  } = setCurrentEventDetails;

  const clearServiceSelectionWarning = (onChange: () => void) => {
    if (selectedServicesIds.length > 0) {
      triggerPopUpModal(
        "If you change this field, your service selection will be cleared.",
        [
          {
            type: "button",
            children: "Continue",
            onClick: () => {
              exitPopUpModal();
              setSelectedServicesDurations([]);
              setSelectedServicesIds([]);
              setSelectedServicesPrices([]);
              onChange();
            },
          },
          {
            type: "button",
            children: "Cancel",
            onClick: () => {
              exitPopUpModal();
            },
          },
        ]
      );
    } else {
      onChange();
    }
  };

  return (
    <section className="eventDetailsInputs">
      <div className="input-wrapper">
        <DateInputs setDateInput={setDate} dateInput={date} />
      </div>
      <ErrorMessage
        message={EventErrorMessages.dateMessage}
        isDisplayed={isSubmitted && !EventVerify.isDateValid(date.join("-"))}
      />

      <div className="input-wrapper">
        <TimeInputs setTimeInput={setTime} timeInput={time} />
      </div>
      <ErrorMessage
        message={EventErrorMessages.timeMessage}
        isDisplayed={
          isSubmitted &&
          !EventVerify.isTimeValid(Global.formatTime(time), date.join("-"))
        }
      />

      <div className="input-wrapper">
        <label htmlFor="address">Address: </label>
        <input
          type="text"
          name="address"
          id="address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
      </div>
      <ErrorMessage
        message={EventErrorMessages.addressMessage}
        isDisplayed={isSubmitted && !EventVerify.isAddressValid(address)}
      />

      <div className="input-wrapper">
        <label htmlFor="city">City: </label>
        <input
          type="text"
          name="city"
          id="city"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
        />
      </div>
      <ErrorMessage
        message={EventErrorMessages.cityStateMessage}
        isDisplayed={isSubmitted && !EventVerify.isCityStateValid(city)}
      />

      <div className="input-wrapper">
        <label htmlFor="state">State: </label>
        <input
          type="text"
          name="state"
          id="state"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
          }}
        />
      </div>
      <ErrorMessage
        message={EventErrorMessages.cityStateMessage}
        isDisplayed={isSubmitted && !EventVerify.isCityStateValid(state)}
      />

      <div className="input-wrapper">
        <label htmlFor="outdoors">Outdoors: </label>
        <div className="radio-wrapper">
          {["yes", "no"].map((item, index) => (
            <div key={index}>
              <input
                type="radio"
                name="outdoors"
                id={item}
                onChange={(e) => {
                  clearServiceSelectionWarning(() => {
                    e.target.id === "yes"
                      ? setOutdoors(true)
                      : setOutdoors(false);
                  });
                }}
                checked={item === "yes" ? outdoors : !outdoors}
              />
              <label htmlFor={item}>{item === "yes" ? "yes" : "no"}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="input-wrapper">
        <label htmlFor="numberOfGuests">Number of Guests: </label>
        <input
          type="number"
          name="numberOfGuests"
          id="numberOfGuests"
          value={numberOfGuests}
          onFocus={(e) => {
            e.currentTarget.select();
          }}
          onClick={(e) => {
            e.currentTarget.select();
          }}
          onChange={(e) => {
            clearServiceSelectionWarning(() => {
              setNumberOfGuests(Number(e.target.value));
            });
          }}
        />
      </div>
      <ErrorMessage
        message={EventErrorMessages.numberOfGuestsMessage}
        isDisplayed={isSubmitted && numberOfGuests < 1}
      />

      <div className="input-wrapper">
        <label>Age Range: </label>
        <div className="range-wrapper">
          {["minGuestAge", "maxGuestAge"].map((elm, index) => {
            return (
              <div key={index}>
                <input
                  type="number"
                  name="ageRange"
                  id={elm}
                  value={index === 0 ? minGuestAge : maxGuestAge}
                  onFocus={(e) => {
                    e.currentTarget.select();
                  }}
                  onClick={(e) => {
                    e.currentTarget.select();
                  }}
                  onChange={(e) => {
                    clearServiceSelectionWarning(() => {
                      index === 0
                        ? setMinGuestAge(Number(e.target.value))
                        : setMaxGuestAge(Number(e.target.value));
                    });
                  }}
                />
                {index === 0 && <span> to </span>}
              </div>
            );
          })}
        </div>
      </div>
      <ErrorMessage
        message={EventErrorMessages.guestAgeMessage}
        isDisplayed={
          isSubmitted &&
          (minGuestAge > maxGuestAge || minGuestAge < 0 || maxGuestAge < 0)
        }
      />
    </section>
  );
};
