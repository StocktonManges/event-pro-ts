import { ChangeEventHandler, useEffect, useState } from "react";
import {
  TripleInputState,
  tripleInputStateSchema,
} from "../../../../utils/types";

export const DateInputs = ({
  setDateInput,
  dateInput,
}: {
  setDateInput: (value: TripleInputState) => void;
  dateInput: TripleInputState;
}) => {
  const [dayMax, setDayMax] = useState<number>(31);
  const currentYear = new Date().getFullYear();

  const yearMin = currentYear;
  const yearMax = currentYear + 1;
  const month = Number(dateInput[0]);
  const day = Number(dateInput[1]);
  const year = Number(dateInput[2]);
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const monthsWith30Days = [4, 6, 9, 11];
  const has30Days = monthsWith30Days.includes(month);

  // Sets the "day" options dynamically based on the year and month.
  let newDayMax = 31;
  if (month === 2 && isLeapYear) {
    newDayMax = 29;
  } else if (month === 2) {
    newDayMax = 28;
  } else if (has30Days) {
    newDayMax = 30;
  }

  useEffect(() => {
    setDayMax(newDayMax);
    // If the current day set in "dateInput" is greater than the
    // "newDayMax", "dateInput" is reset to the correct max date.
    if (day > newDayMax) {
      setDateInput([dateInput[0], newDayMax.toString(), dateInput[2]]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDayMax]);

  const createOnChangeHandler =
    (index: number): ChangeEventHandler<HTMLSelectElement> =>
    (e) => {
      const value = e.target.value;

      const newState = tripleInputStateSchema.parse(
        dateInput.map((dateInput, dateInputIndex) => {
          if (dateInputIndex === index) {
            return value;
          }
          return dateInput;
        })
      );

      setDateInput(newState);
    };

  const createOptionArr = (
    startNum: number,
    endNum: number,
    dateElm: "mm" | "dd" | "yyyy"
  ) => {
    const optionArr = [];
    for (let option = startNum - 1; option <= endNum; option++) {
      const newNum =
        option.toString().length === 1
          ? "0" + option.toString()
          : option.toString();
      optionArr.push(
        <option value={option === startNum - 1 ? dateElm : newNum} key={option}>
          {option === startNum - 1 ? dateElm : newNum}
        </option>
      );
    }
    return optionArr;
  };

  const monthOptions = createOptionArr(1, 12, "mm");
  const dayOptions = createOptionArr(1, dayMax, "dd");
  const yearOptions = createOptionArr(yearMin, yearMax, "yyyy");

  const createSelect = (dateElm: string, index: number) => {
    let options = monthOptions;
    if (index === 1) {
      options = dayOptions;
    } else if (index === 2) {
      options = yearOptions;
    }
    return (
      <select
        id={dateElm}
        name={dateElm}
        key={index}
        value={dateInput[index]}
        onChange={createOnChangeHandler(index)}
      >
        {options}
      </select>
    );
  };

  return (
    <>
      <label htmlFor="date">Date: </label>
      <div className="triple-input-wrapper">
        {["month", "day", "year"].map((dateElm, index) => {
          const isLastIteration = index === 2;
          return (
            <span key={index}>
              {createSelect(dateElm, index)}
              {!isLastIteration && <div>/</div>}
            </span>
          );
        })}
      </div>
    </>
  );
};
