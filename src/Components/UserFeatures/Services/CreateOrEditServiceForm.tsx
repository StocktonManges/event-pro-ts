import { UsePopUpModal } from "../../../Providers/PopUpModalProvider";
import { UseNav } from "../../../Providers/NavProvider";
import { UseServices } from "../../../Providers/ServicesProvider";
import { useEffect, useState } from "react";
import { Global } from "../../../utils/GlobalVarsAndFuncs";
import { pricingMethodOption } from "../../../utils/types";
import { ErrorMessage } from "../../ErrorMessage";
import {
  ServiceErrorMessages,
  ServiceVerify,
} from "../../../utils/ServiceValidations";
import { UseEvents } from "../../../Providers/EventsProvider";

export const CreateOrEditServiceForm = () => {
  const {
    currentServiceDetails,
    setCurrentServiceDetails,
    serviceBeingEdited,
    setServiceBeingEdited,
    resetCreateOrEditServiceForm,
    handelValidSubmit,
    handleInvalidSubmit,
    isSubmitted,
    setIsSubmitted,
    deleteService,
    updateService,
  } = UseServices();
  const { triggerPopUpModal, exitPopUpModal } = UsePopUpModal();
  const { navigate, navUrls } = UseNav();
  const { currentProviderEvents } = UseEvents();

  const [fixedDuration, setFixedDuration] = useState<boolean>(false);

  const {
    id,
    title,
    description,
    image,
    minAge,
    maxAge,
    minParticipants,
    maxParticipants,
    duration,
    outdoors,
    pricingMethod,
    price,
    active,
  } = currentServiceDetails;
  const {
    setTitle,
    setDescription,
    setImage,
    setMinAge,
    setMaxAge,
    setMinParticipants,
    setMaxParticipants,
    setDuration,
    setOutdoors,
    setPricingMethod,
    setPrice,
    setActive,
  } = setCurrentServiceDetails;

  const editingService = serviceBeingEdited.id > -1;

  const clearDurationWarning = (onChange: () => void) => {
    if (duration > 0) {
      return triggerPopUpModal(
        "If you change this field, the duration will be cleared.",
        [
          {
            type: "button",
            children: "Continue",
            onClick: () => {
              exitPopUpModal();
              setDuration(0);
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
    }
    onChange();
  };

  const serviceBookedCannotDeleteWarning = () => {
    triggerPopUpModal(
      "This service has been booked for one or more future events. Once all of your events have been completed, you may cancel this service. Would you like to make this service unavailable to avoid further bookings?",
      [
        {
          type: "button",
          children: "Yes, make this service unavailable.",
          onClick: () => {
            exitPopUpModal();
            updateService({ ...currentServiceDetails, active: false });
            navigate(navUrls.userServices);
            resetCreateOrEditServiceForm();
            setIsSubmitted(false);
            if (editingService) {
              sessionStorage.setItem(
                "serviceBeingEdited",
                JSON.stringify(Global.emptyService)
              );
              setServiceBeingEdited(Global.emptyService);
            }
          },
        },
        {
          type: "button",
          children: "No, keep this service available.",
          onClick: () => {
            exitPopUpModal();
          },
        },
      ]
    );
  };

  const cancelServiceWarning = () => {
    triggerPopUpModal("Are you sure you want to delete this service?", [
      {
        type: "button",
        children: "Yes",
        onClick: () => {
          exitPopUpModal();
          navigate(navUrls.userServices);
          deleteService(id);
          sessionStorage.setItem(
            "serviceBeingEdited",
            JSON.stringify(Global.emptyService)
          );
          setServiceBeingEdited(Global.emptyService);
          setIsSubmitted(false);
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

  const informationWillNotSaveWarning = () => {
    triggerPopUpModal(
      `If you cancel, your ${
        !editingService ? "information" : "changes"
      } will not be saved. Do you want to continue?`,
      [
        {
          type: "button",
          children: "Yes",
          onClick: () => {
            exitPopUpModal();
            navigate(navUrls.userServices);
            resetCreateOrEditServiceForm();
            setIsSubmitted(false);
            if (editingService) {
              sessionStorage.setItem(
                "serviceBeingEdited",
                JSON.stringify(Global.emptyService)
              );
              setServiceBeingEdited(Global.emptyService);
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

  const ValidationsPassed =
    title.trim() !== "" &&
    ServiceVerify.isDescriptionValid(description) &&
    ((fixedDuration && duration > 0) || (!fixedDuration && duration === 0)) &&
    price > 0 &&
    minAge <= maxAge &&
    minAge >= 0 &&
    minParticipants <= maxParticipants &&
    minParticipants >= 0;

  useEffect(() => {
    if (duration > 0) {
      setFixedDuration(true);
    }
  }, [duration]);

  return (
    <section className="create-or-edit-service-form">
      <div>
        <h2>{!editingService ? "Create a new service!" : "Edit a service!"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ValidationsPassed ? handelValidSubmit() : handleInvalidSubmit();
          }}
        >
          <div className="input-wrapper">
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value.slice(0, 55));
              }}
            />
          </div>
          <ErrorMessage
            message={ServiceErrorMessages.titleMessage}
            isDisplayed={isSubmitted && title.trim() === ""}
          />

          <div className="input-wrapper textarea-wrapper">
            <label htmlFor="description">Description: </label>
            <textarea
              name="description"
              id="description"
              placeholder="Description of the service..."
              value={description}
              onChange={(e) => {
                // Only allows 70 characters.
                setDescription(e.target.value.slice(0, 70));
              }}
            />
            <span>{70 - description.length}</span>
          </div>
          <ErrorMessage
            message={ServiceErrorMessages.descriptionMessage}
            isDisplayed={
              isSubmitted && !ServiceVerify.isDescriptionValid(description)
            }
          />

          <div className="input-wrapper">
            <label htmlFor="image">Image: </label>
            <input
              type="file"
              name="image"
              id="image"
              value={image}
              onChange={(e) => {
                /* Insert handleImageUpload function here. */
                setImage(e.target.value);
              }}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="pricingMethod">Charge per: </label>
            <select
              name="pricingMethod"
              id="pricingMethod"
              value={pricingMethod}
              onChange={(e) => {
                clearDurationWarning(() => {
                  setPricingMethod(pricingMethodOption.parse(e.target.value));
                });
              }}
            >
              <option value="event">Event</option>
              <option value="hour">Hour</option>
              <option value="participant">Participant</option>
            </select>
          </div>

          <div className="input-wrapper">
            <label>Fixed Duration: </label>
            <div className="radio-wrapper">
              {["yesDuration", "noDuration"].map((item, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    name="fixedDuration"
                    id={item}
                    onChange={(e) => {
                      clearDurationWarning(() => {
                        e.target.id === "yesDuration"
                          ? setFixedDuration(true)
                          : setFixedDuration(false);
                      });
                    }}
                    checked={
                      item === "yesDuration"
                        ? fixedDuration && pricingMethod !== "hour"
                        : !fixedDuration || pricingMethod === "hour"
                    }
                  />
                  <label htmlFor={item}>
                    {item === "yesDuration" ? "yes" : "no"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="input-wrapper">
            <label htmlFor="duration">Duration: </label>
            <input
              disabled={!fixedDuration || pricingMethod === "hour"}
              type="number"
              name="duration"
              id="duration"
              step={0.5}
              value={duration}
              onFocus={(e) => {
                e.currentTarget.select;
              }}
              onClick={(e) => {
                e.currentTarget.select();
              }}
              onChange={(e) => {
                setDuration(Number(e.target.value));
              }}
            />
          </div>
          <ErrorMessage
            message={ServiceErrorMessages.durationMessage}
            isDisplayed={isSubmitted && fixedDuration && duration <= 0}
          />

          <div className="input-wrapper">
            <label htmlFor="price">Price: </label>
            <input
              type="number"
              name="price"
              id="price"
              max={Infinity}
              min={Infinity}
              value={price}
              onFocus={(e) => {
                e.currentTarget.select();
              }}
              onClick={(e) => {
                e.currentTarget.select();
              }}
              onChange={(e) => {
                setPrice(Number(e.target.value));
              }}
            />
          </div>
          <ErrorMessage
            message={ServiceErrorMessages.priceMessage}
            isDisplayed={isSubmitted && price <= 0}
          />

          <div className="input-wrapper">
            <label>Outdoors: </label>
            <div className="radio-wrapper">
              {["yesOutdoors", "noOutdoors"].map((item, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    name="outdoors"
                    id={item}
                    onChange={(e) => {
                      e.target.id === "yesOutdoors"
                        ? setOutdoors(true)
                        : setOutdoors(false);
                    }}
                    checked={item === "yesOutdoors" ? outdoors : !outdoors}
                  />
                  <label htmlFor={item}>
                    {item === "yesOutdoors" ? "yes" : "no"}
                  </label>
                </div>
              ))}
            </div>
          </div>

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
                      value={index === 0 ? minAge : maxAge}
                      onFocus={(e) => {
                        e.currentTarget.select();
                      }}
                      onClick={(e) => {
                        e.currentTarget.select();
                      }}
                      onChange={(e) => {
                        index === 0
                          ? setMinAge(Number(e.target.value))
                          : setMaxAge(Number(e.target.value));
                      }}
                    />
                    {index === 0 && <span> to </span>}
                  </div>
                );
              })}
            </div>
          </div>
          <ErrorMessage
            message={ServiceErrorMessages.ageMessage}
            isDisplayed={
              isSubmitted && (minAge > maxAge || minAge < 0 || maxAge < 0)
            }
          />

          <div className="input-wrapper">
            <label>Participants Expected: </label>
            <div className="range-wrapper">
              {["minParticipants", "maxParticipants"].map((elm, index) => {
                return (
                  <div key={index}>
                    <input
                      type="number"
                      name="participantRange"
                      id={elm}
                      value={index === 0 ? minParticipants : maxParticipants}
                      onFocus={(e) => {
                        e.currentTarget.select();
                      }}
                      onClick={(e) => {
                        e.currentTarget.select();
                      }}
                      onChange={(e) => {
                        index === 0
                          ? setMinParticipants(Number(e.target.value))
                          : setMaxParticipants(Number(e.target.value));
                      }}
                    />
                    {index === 0 && <span> to </span>}
                  </div>
                );
              })}
            </div>
          </div>
          <ErrorMessage
            message={ServiceErrorMessages.participantMessage}
            isDisplayed={
              isSubmitted &&
              (minParticipants > maxParticipants || minParticipants < 0)
            }
          />

          <div className="input-wrapper">
            <label>Active: </label>
            <div className="radio-wrapper">
              {["yesActive", "noActive"].map((item, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    name="active"
                    id={item}
                    onChange={(e) => {
                      e.target.id === "yesActive"
                        ? setActive(true)
                        : setActive(false);
                    }}
                    checked={item === "yesActive" ? active : !active}
                  />
                  <label htmlFor={item}>
                    {item === "yesActive" ? "yes" : "no"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="button-wrapper">
            <button
              type="button"
              className={editingService ? "" : "btn-coral"}
              onClick={() => {
                informationWillNotSaveWarning();
              }}
            >
              {!editingService ? "Cancel" : "Cancel Changes"}
            </button>

            <button className="btn-dark-green" type="submit">
              {editingService ? "Save" : "Submit"}
            </button>

            {editingService && (
              <button
                type="button"
                className="btn-coral"
                onClick={() => {
                  const incompleteProviderEvents = currentProviderEvents.filter(
                    ({ status }) => status !== "completed"
                  );
                  if (incompleteProviderEvents.length > 0) {
                    serviceBookedCannotDeleteWarning();
                  } else {
                    cancelServiceWarning();
                  }
                }}
              >
                Delete Service
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
