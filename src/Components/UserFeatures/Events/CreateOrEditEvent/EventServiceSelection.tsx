import { SelectedServicesList } from "./SelectedServicesList";
import { UseEvents } from "../../../../Providers/EventsProvider";
import { ErrorMessage } from "../../../ErrorMessage";
import {
  EventErrorMessages,
  EventVerify,
} from "../../../../utils/EventValidations";

export const EventServiceSelection = () => {
  const { currentEventDetails, setCurrentEventDetails, isSubmitted } =
    UseEvents();
  const { selectedServicesIds } = currentEventDetails;
  const { setNotes } = setCurrentEventDetails;

  return (
    <section className="event-service-selection">
      <div className="input-wrapper">
        <SelectedServicesList />
      </div>
      <ErrorMessage
        message={EventErrorMessages.servicesMessage}
        isDisplayed={
          isSubmitted &&
          !EventVerify.isServiceSelectionValid(selectedServicesIds)
        }
      />

      <div className="input-wrapper textarea-wrapper">
        <label htmlFor="notes">Notes: </label>
        <textarea
          name="notes"
          id="notes"
          placeholder="Additional notes for the service provider..."
          value={currentEventDetails.notes}
          onChange={(e) => {
            setNotes(e.target.value);
          }}
        />
      </div>
    </section>
  );
};
