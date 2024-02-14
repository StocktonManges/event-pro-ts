import { useState } from "react";
import { UseEvents } from "../../../../Providers/EventsProvider";
import { UseNav } from "../../../../Providers/NavProvider";
import { Service } from "../../../../utils/types";

export const HourSelectionModal = ({
  setHourModalActive,
  hourModalActive,
  exitModal,
  service,
}: {
  setHourModalActive: (value: boolean) => void;
  hourModalActive: boolean;
  exitModal: () => void;
  service: Service;
}) => {
  const { navigate, navUrls } = UseNav();
  const { addSelectedService } = UseEvents();
  const [hours, setHours] = useState<number>(0.5);

  const resetHourSelectionModal = () => {
    exitModal();
    setHourModalActive(false);
    setHours(0.5);
  };

  const createOptionArr = (
    startNum: number,
    endNum: number,
    numberElm: string
  ) => {
    const optionArr = [];
    for (let option = startNum; option <= endNum; option += 0.5) {
      optionArr.push(
        <option value={option} key={numberElm + option}>
          {option}
        </option>
      );
    }
    return optionArr;
  };

  return (
    <section
      className={`modal-background ${hourModalActive ? "fade-in" : "fade-out"}`}
      onClick={() => {
        setHourModalActive(false);
      }}
    >
      <div
        className={`hour-selection-modal ${
          hourModalActive ? "selecting-hour" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span>How long would you like to book this service for?</span>
        <div>
          <select
            name="hours"
            id="hours"
            value={hours}
            onChange={(e) => {
              setHours(Number(e.target.value));
            }}
          >
            {createOptionArr(0.5, 3, "hours")}
          </select>
          <span> hours</span>
        </div>
        <div>
          <button
            className="btn-light-green"
            type="button"
            onClick={() => {
              addSelectedService(service, hours);
              navigate(navUrls.scheduleEvent);
              resetHourSelectionModal();
            }}
          >
            Continue
          </button>
          <button
            className="btn-coral"
            type="button"
            onClick={() => {
              resetHourSelectionModal();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};
