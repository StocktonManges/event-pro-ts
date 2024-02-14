/* eslint-disable react-hooks/exhaustive-deps */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { PricingMethodOption, Service } from "../utils/types";
import { Requests } from "../api/getData";
import toast from "react-hot-toast";
import { Global } from "../utils/GlobalVarsAndFuncs";
import { ServicesRequests } from "../api/services";
import { UseAuth } from "./AuthProvider";
import { UseNav } from "./NavProvider";

type FilteredServicesByActiveStatus = {
  activeServices: Service[];
  inactiveServices: Service[];
};

type TypeServicesProvider = {
  allServices: Service[];
  getServiceFromId: (value: number) => Service;
  updateService: (
    newServiceInfo: Service | Omit<Service, "image">
  ) => Promise<Service | string>;
  deactivateAllProviderServices: () => void;
  currentProviderServices: Service[];
  resetCreateOrEditServiceForm: () => void;
  createService: (
    serviceWithoutId: Omit<Service, "id">
  ) => Promise<Service | string>;
  refetchAllServices: () => Promise<Service[] | string>;
  populateServiceDetails: (service: Service) => void;
  serviceBeingEdited: Service;
  setServiceBeingEdited: (value: Service) => void;
  handelValidSubmit: () => void;
  handleInvalidSubmit: () => void;
  deleteService: (serviceId: number) => Promise<void | string>;
  isSubmitted: boolean;
  setIsSubmitted: (value: boolean) => void;
  filteredServicesByActiveStatus: FilteredServicesByActiveStatus;
  currentServiceDetails: {
    id: number;
    providerId: number;
    title: string;
    description: string;
    image: string | undefined;
    minAge: number;
    maxAge: number;
    minParticipants: number;
    maxParticipants: number;
    duration: number;
    outdoors: boolean;
    pricingMethod: PricingMethodOption;
    price: number;
    active: boolean;
  };
  setCurrentServiceDetails: {
    setId: (value: number) => void;
    setProviderId: (value: number) => void;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setImage: (value: string | undefined) => void;
    setMinAge: (value: number) => void;
    setMaxAge: (value: number) => void;
    setMinParticipants: (value: number) => void;
    setMaxParticipants: (value: number) => void;
    setDuration: (value: number) => void;
    setOutdoors: (value: boolean) => void;
    setPricingMethod: (value: PricingMethodOption) => void;
    setPrice: (value: number) => void;
    setActive: (value: boolean) => void;
  };
};

const servicesContext = createContext<TypeServicesProvider>(
  {} as TypeServicesProvider
);
export const UseServices = () => useContext(servicesContext);

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = UseAuth();
  const { navigate, navUrls } = UseNav();

  const [allServices, setAllServices] = useState<Service[]>([]);
  const [currentProviderServices, setCurrentProviderServices] = useState<
    Service[]
  >([]);
  const [serviceBeingEdited, setServiceBeingEdited] = useState<Service>(
    Global.emptyService
  );
  const [filteredServicesByActiveStatus, setFilteredServicesByActiveStatus] =
    useState<FilteredServicesByActiveStatus>({
      activeServices: [],
      inactiveServices: [],
    });

  const [id, setId] = useState<number>(-1);
  const [providerId, setProviderId] = useState<number>(-1);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(0);
  const [minParticipants, setMinParticipants] = useState<number>(1);
  const [maxParticipants, setMaxParticipants] = useState<number>(1);
  const [duration, setDuration] = useState<number>(0);
  const [outdoors, setOutdoors] = useState<boolean>(false);
  const [pricingMethod, setPricingMethod] =
    useState<PricingMethodOption>("event");
  const [price, setPrice] = useState<number>(0);
  const [active, setActive] = useState<boolean>(true);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const currentServiceDetails = {
    id,
    providerId,
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
  };

  const setCurrentServiceDetails = {
    setId,
    setProviderId,
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
  };

  const createService = (
    serviceWithoutId: Omit<Service, "id">
  ): Promise<Service | string> =>
    ServicesRequests.postService(serviceWithoutId)
      .then((service) => {
        toast.success("Created service.");
        fetchCurrentProviderServices();
        return service;
      })
      .catch((error) => toast.error(error.message));

  const getServiceFromId = (serviceId: number): Service => {
    const service = allServices.find((service) => service.id === serviceId);
    return service ? service : Global.emptyService;
  };

  const resetCreateOrEditServiceForm = () => {
    setId(-1);
    setProviderId(-1);
    setTitle("");
    setDescription("");
    setImage(undefined);
    setMinAge(0);
    setMaxAge(0);
    setMinParticipants(1);
    setMaxParticipants(1);
    setDuration(0);
    setOutdoors(false);
    setPricingMethod("event");
    setPrice(0);
    setActive(true);

    setServiceBeingEdited(Global.emptyService);
    sessionStorage.setItem(
      "serviceBeingEdited",
      JSON.stringify(Global.emptyService)
    );
  };

  const handleCreateService = () => {
    createService({
      providerId: currentUser.id,
      title: title.trim(),
      description: description.trim(),
      // need server-side code to download images to source code.
      image: `${Global.baseFolderURL}/src/assets/images/default-service-image.png`,
      minAge,
      maxAge,
      minParticipants,
      maxParticipants,
      duration,
      outdoors,
      pricingMethod,
      price,
      active,
    }).then(() => {
      resetCreateOrEditServiceForm();
      setIsSubmitted(false);
      navigate(navUrls.userServices);
      refetchAllServices();
    });
  };

  const handelValidSubmit = () => {
    serviceBeingEdited.id === -1 ? handleCreateService() : handleEditService();
  };

  const handleInvalidSubmit = () => {
    toast.error("Invalid service details.", { id: "invalidServiceDetails" });
    setIsSubmitted(true);
  };

  const filterCurrentProviderServicesByActiveStatus = (
    providerServices: Service[]
  ) => {
    const activeServices = providerServices.filter(({ active }) => active);
    const inactiveServices = providerServices.filter(({ active }) => !active);
    setFilteredServicesByActiveStatus({ activeServices, inactiveServices });
  };

  const fetchCurrentProviderServices = (): Promise<Service[] | string> =>
    ServicesRequests.getCurrentProviderServices(currentUser.id)
      .then((services) => {
        setCurrentProviderServices(services);
        filterCurrentProviderServicesByActiveStatus(services);
        return services;
      })
      .catch((error) => toast.error(error.message));

  const refetchAllServices = (): Promise<string | Service[]> =>
    Requests.fetchServices()
      .then((services) => {
        setAllServices(services);
        return services;
      })
      .catch((error) => toast.error(error.message));

  /*********************** EDITING SERVICE CODE ***********************/

  const updateService = (
    newServiceInfo: Service | Omit<Service, "image">
  ): Promise<Service | string> =>
    ServicesRequests.patchService(newServiceInfo)
      .then((editedService) => {
        toast.success("Service updated.");
        fetchCurrentProviderServices();
        return editedService;
      })
      .catch((error) => toast.error(error.message));

  const deleteService = (serviceId: number): Promise<void | string> =>
    ServicesRequests.deleteService(serviceId)
      .then(() => {
        fetchCurrentProviderServices();
        toast.success("Service deleted.");
      })
      .catch((error) => toast.error(error.message));

  const deactivateAllProviderServices = () => {
    currentProviderServices.map((service) => {
      updateService({ ...service, active: false });
    });
  };

  const handleEditService = () => {
    const serviceInfo: Service = {
      id,
      providerId,
      title: title.trim(),
      description: description.trim(),
      // need server-side code to download images to source code.
      image: undefined,
      minAge,
      maxAge,
      minParticipants,
      maxParticipants,
      duration,
      outdoors,
      pricingMethod,
      price,
      active,
    };
    const { image, ...serviceInfoNoImage } = serviceInfo;
    updateService(image ? serviceInfo : serviceInfoNoImage).then(() => {
      refetchAllServices();
      resetCreateOrEditServiceForm();
      navigate(navUrls.userServices);
      setServiceBeingEdited(Global.emptyService);
      sessionStorage.setItem(
        "serviceBeingEdited",
        JSON.stringify(Global.emptyService)
      );
    });
  };

  const populateServiceDetails = (service: Service) => {
    setId(service.id);
    setProviderId(service.providerId);
    setTitle(service.title);
    setDescription(service.description);
    setImage(undefined);
    setMinAge(service.minAge);
    setMaxAge(service.maxAge);
    setMinParticipants(service.minParticipants);
    setMaxParticipants(service.maxParticipants);
    setDuration(service.duration);
    setOutdoors(service.outdoors);
    setPricingMethod(service.pricingMethod);
    setPrice(service.price);
    setActive(service.active);
  };

  const repopulateServiceFormWithServiceBeingEditedDetails = () => {
    const potentialServiceDetails =
      sessionStorage.getItem("serviceBeingEdited");
    const serviceDetails: Service = potentialServiceDetails
      ? JSON.parse(potentialServiceDetails)
      : Global.emptyService;

    setServiceBeingEdited({ ...serviceDetails, image: undefined });
    populateServiceDetails({ ...serviceDetails, image: undefined });
  };

  useEffect(() => {
    fetchCurrentProviderServices();
  }, [currentUser]);

  useEffect(() => {
    refetchAllServices();
    repopulateServiceFormWithServiceBeingEditedDetails();
  }, [currentUser]);

  return (
    <servicesContext.Provider
      value={{
        allServices,
        getServiceFromId,
        updateService,
        deactivateAllProviderServices,
        currentProviderServices,
        resetCreateOrEditServiceForm,
        createService,
        refetchAllServices,
        populateServiceDetails,
        serviceBeingEdited,
        setServiceBeingEdited,
        handelValidSubmit,
        handleInvalidSubmit,
        deleteService,
        isSubmitted,
        setIsSubmitted,
        filteredServicesByActiveStatus,
        currentServiceDetails,
        setCurrentServiceDetails,
      }}
    >
      {children}
    </servicesContext.Provider>
  );
};
