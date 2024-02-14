import { ChangeEventHandler, useRef } from "react";
import {
  TripleInputState,
  tripleInputStateSchema,
} from "../../../../utils/types";

export const TimeInputs = ({
  setTimeInput,
  timeInput,
}: {
  setTimeInput: (value: TripleInputState) => void;
  timeInput: TripleInputState;
}) => {
  const inputRefs = [
    useRef<HTMLSelectElement>(null),
    useRef<HTMLSelectElement>(null),
    useRef<HTMLSelectElement>(null),
  ];

  const createOnChangeHandler =
    (index: number): ChangeEventHandler<HTMLSelectElement> =>
    (e) => {
      const nextRef = inputRefs[index + 1];
      const value = e.target.value;

      // Go to the next input if it's not the last one.
      const goToNextRef = () => {
        if (index !== 2) {
          nextRef.current?.focus();
        }
      };

      const newState = tripleInputStateSchema.parse(
        timeInput.map((timeInput, timeInputIndex) => {
          if (timeInputIndex === index) {
            return value;
          }
          return timeInput;
        })
      );

      goToNextRef();
      setTimeInput(newState);
    };

  const createOptionArr = (
    startNum: number,
    endNum: number,
    numberElm: string,
    step: number = 1
  ) => {
    const optionArr = [
      <option key={numberElm} value={numberElm}>
        {numberElm}
      </option>,
    ];
    for (let option = startNum; option <= endNum; option += step) {
      const newNum =
        option.toString().length === 1
          ? "0" + option.toString()
          : option.toString();
      optionArr.push(
        <option value={newNum} key={numberElm + option}>
          {newNum}
        </option>
      );
    }
    return optionArr;
  };

  const hourOptions = createOptionArr(1, 12, "hr");
  const minOptions = createOptionArr(0, 59, "min", 15);
  const meridiemOptions = ["--", "AM", "PM"].map((timeElm, index) => (
    <option value={timeElm} key={index}>
      {timeElm}
    </option>
  ));

  const createSelect = (timeElm: string, index: number) => {
    let options = hourOptions;
    if (index === 1) {
      options = minOptions;
    } else if (index === 2) {
      options = meridiemOptions;
    }
    return (
      <select
        id={timeElm}
        name={timeElm}
        ref={inputRefs[index]}
        value={timeInput[index]}
        onChange={createOnChangeHandler(index)}
      >
        {options}
      </select>
    );
  };

  return (
    <>
      <label htmlFor="time">Time: </label>
      <div className="triple-input-wrapper">
        {["hour", "minute", "meridiem"].map((timeElm, index) => {
          const insertColon = index === 0;
          return (
            <span key={index}>
              {createSelect(timeElm, index)}
              {insertColon && <div>:</div>}
            </span>
          );
        })}
      </div>
    </>
  );
};
