import { UseEvents } from "../../../../Providers/EventsProvider";
import { EventDetailsInputs } from "./EventDetailsInputs";
import { EventServiceSelection } from "./EventServiceSelection";
import { UsePopUpModal } from "../../../../Providers/PopUpModalProvider";
import { UseNav } from "../../../../Providers/NavProvider";
import { Global } from "../../../../utils/GlobalVarsAndFuncs";

export const CreateOrEditEventForm = () => {
  const {
    validationsPassed,
    handleValidSubmit,
    handleInvalidSubmit,
    resetCreateOrEditEventForm,
    eventBeingEdited,
    setEventBeingEdited,
    currentEventDetails,
    cancelEvent,
  } = UseEvents();
  const { triggerPopUpModal, exitPopUpModal } = UsePopUpModal();
  const { navigate, navUrls } = UseNav();

  const editingEvent = eventBeingEdited.id > -1;

  const cancelWithoutSavingWarning = () => {
    triggerPopUpModal(
      `Your new information will not be saved. Do you want to continue?`,
      [
        {
          type: "button",
          children: "Yes",
          onClick: () => {
            exitPopUpModal();
            resetCreateOrEditEventForm();
            navigate(navUrls.userEvents);
            if (editingEvent) {
              sessionStorage.setItem(
                "eventBeingEdited",
                JSON.stringify(Global.emptyEvent)
              );
              setEventBeingEdited(Global.emptyEvent);
            }
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

  const cancelEventWarning = () => {
    triggerPopUpModal("Are you sure you want to cancel this event?", [
      {
        type: "button",
        children: "Yes",
        onClick: () => {
          exitPopUpModal();
          cancelEvent(currentEventDetails.id);
          resetCreateOrEditEventForm();
          navigate(navUrls.userEvents);
          sessionStorage.setItem(
            "eventBeingEdited",
            JSON.stringify(Global.emptyEvent)
          );
          setEventBeingEdited(Global.emptyEvent);
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

  return (
    <section className="create-or-edit-event-form">
      <div>
        <h2>{!editingEvent ? "Book a new Event!" : "Edit an Event!"}</h2>
        {editingEvent && <div>Status: {currentEventDetails.status}</div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            validationsPassed ? handleValidSubmit() : handleInvalidSubmit();
          }}
        >
          <EventDetailsInputs />
          <EventServiceSelection />

          <div className="button-wrapper">
            <button
              type="button"
              className={editingEvent ? "" : "btn-coral"}
              onClick={() => {
                cancelWithoutSavingWarning();
              }}
            >
              {!editingEvent ? "Cancel" : "Cancel Changes"}
            </button>

            <button className="btn-dark-green" type="submit">
              {editingEvent ? "Save" : "Submit"}
            </button>

            {editingEvent && (
              <button
                type="button"
                className="btn-coral"
                onClick={() => {
                  cancelEventWarning();
                }}
              >
                Cancel Event
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
